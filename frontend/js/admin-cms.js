(() => {
  const API_BASE = window.CMS_API_BASE || (
    location.protocol === 'file:' || location.hostname.endsWith('github.io')
      ? 'http://localhost:6000/api'
      : '/api'
  );
  const DB = {};
  const state = { user: null, token: sessionStorage.getItem('cms_token') || '', deleteCtx: null };
  let deleteModal;

  const roleLabels = {
    super: { label: 'Super Admin', cls: 'role-super' },
    admin: { label: 'Admin', cls: 'role-admin' },
    editor: { label: 'Editor', cls: 'role-editor' },
    viewer: { label: 'Visualizador', cls: 'role-viewer' },
  };

  const schemas = {
    home_main: ['home_Titulo', 'home_subtitulo'],
    home_carousel: ['Image_Titulo', 'Image_Descricao', 'Image_Backgroud'],
    home_info: ['info_texto', 'info_image'],
    sobre_main: ['sobre_Titulo', 'sobre_subtitulo'],
    historia: ['Historia_titulo', 'Historia_texto', 'Historia_Image'],
    principios: ['principios_titulo', 'principios_texto', 'principios_icone'],
    equipe: ['equipe_especialista', 'equipe_universidade', 'equipe_formacao', 'equipe_image'],
    diferenciais: ['Diferenciais_descricao'],
    catalogo_main: ['catalogo_Titulo', 'catalogo_subtitulo'],
    item_catalogo: ['item_catalogo_titulo', 'item_catalogo_descricao_curta', 'item_catalogo_descricao_modal'],
    contato_main: ['contato_titulo', 'contato_subtitulo'],
    mensagem: ['mensagem_nome', 'mensagem_email', 'mensagem_texto'],
    localizacao: ['localizacao_maps', 'localizacao_endereco'],
    contato_info: ['contato_info_telefone', 'contato_info_whatsapp', 'contato_info_texto_atendimento'],
  };

  const apiFetch = async (path, options = {}) => {
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    if (state.token) headers.set('Authorization', `Bearer ${state.token}`);
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) {
      const error = new Error(payload?.error || `Erro HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return payload;
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));
  const truncate = (value, length) => value.length > length ? `${value.slice(0, length)}…` : value;
  const getRows = (table) => DB[table] || [];
  const formFor = (table) => document.getElementById(`form-${table}`);

  function setSession(user, token) {
    state.user = user;
    state.token = token || '';
    if (state.token) sessionStorage.setItem('cms_token', state.token);
  }

  function clearSession() {
    state.user = null;
    state.token = '';
    sessionStorage.removeItem('cms_token');
  }

  function showPanel(user) {
    state.user = user;
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('panel-screen').style.display = 'flex';
    document.getElementById('topbar-name').textContent = user.admin_nome || user.admin_email;
    document.getElementById('topbar-role').textContent = roleLabels[user.admin_perfil]?.label || user.admin_perfil;
    document.getElementById('topbar-avatar').textContent = (user.admin_nome || user.admin_email).charAt(0).toUpperCase();
    document.getElementById('nav-admins').style.display = user.admin_perfil === 'super' ? 'flex' : 'none';
    loadAll().catch((error) => showToast(error.message, 'danger'));
  }

  window.doLogin = async function doLogin() {
    const login = document.getElementById('login-user')?.value.trim();
    const password = document.getElementById('login-pass')?.value || '';
    const errorBox = document.getElementById('login-error');
    if (errorBox) errorBox.style.display = 'none';
    if (!login || !password) {
      if (errorBox) { errorBox.textContent = 'Informe o usuário/e-mail e a senha.'; errorBox.style.display = 'block'; }
      return;
    }
    try {
      const result = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ login, password }) });
      setSession(result.user, result.token);
      showPanel(result.user);
    } catch (error) {
      if (errorBox) { errorBox.textContent = error.message || 'Usuário ou senha incorretos.'; errorBox.style.display = 'block'; }
    }
  };

  window.doLogout = async function doLogout() {
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (_) { /* token já pode ter expirado */ }
    clearSession();
    document.getElementById('panel-screen').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('nav-admins').style.display = 'none';
  };

  async function restoreSession() {
    if (!state.token) return;
    try {
      const result = await apiFetch('/auth/me');
      showPanel(result.user);
    } catch (_) {
      clearSession();
    }
  }

  async function loadAll() {
    const data = await apiFetch('/cms');
    Object.assign(DB, data);
    Object.keys(schemas).forEach(renderTable);
    if (state.user?.admin_perfil === 'super') await loadAdmins();
  }

  async function loadAdmins() {
    DB._admins = await apiFetch('/admins');
    renderAdmins();
    renderAdminStats();
  }

  window.showPage = function showPage(page, link) {
    document.querySelectorAll('.page').forEach((element) => element.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach((element) => element.classList.remove('active'));
    document.getElementById(`page-${page}`)?.classList.add('active');
    if (link) link.classList.add('active');
    if (page === 'admins' && state.user?.admin_perfil === 'super') loadAdmins().catch((error) => showToast(error.message, 'danger'));
  };

  window.switchTab = function switchTab(link, page, tab) {
    const parent = link.closest('.page');
    parent.querySelectorAll('.nav-link').forEach((element) => element.classList.remove('active'));
    parent.querySelectorAll('.tab-pane').forEach((element) => element.classList.remove('active'));
    link.classList.add('active');
    document.getElementById(`${page}-tab-${tab}`)?.classList.add('active');
  };

  window.handleSubmit = async function handleSubmit(event, table) {
    event.preventDefault();
    const form = event.target;
    const formData = Object.fromEntries(new FormData(form));
    const id = formData.id || '';
    delete formData.id;
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
    try {
      const response = await apiFetch(id ? `/cms/${table}/${encodeURIComponent(id)}` : `/cms/${table}`, {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(formData),
      });
      DB[table] = id
        ? getRows(table).map((row) => String(row._id) === String(id) ? response : row)
        : [response, ...getRows(table)];
      resetContentForm(table);
      renderTable(table);
      showToast(id ? 'Registro atualizado!' : 'Registro inserido!', 'success');
    } catch (error) {
      showToast(error.message || 'Não foi possível guardar o registro.', 'danger');
    } finally {
      if (button) button.disabled = false;
    }
  };

  window.resetContentForm = function resetContentForm(table) {
    const form = formFor(table);
    if (!form) return;
    form.reset();
    if (form.elements.id) form.elements.id.value = '';
    const button = form.querySelector('button[type="submit"]');
    if (button) button.innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Inserir / Atualizar';
  };

  function renderTable(table) {
    const tbody = document.getElementById(`tb-${table}`);
    if (!tbody) return;
    const rows = getRows(table);
    const fields = schemas[table] || [];
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${fields.length + 2}" class="text-center text-muted py-3">Nenhum registro</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map((row, index) => `<tr>
      <td>${index + 1}</td>
      ${fields.map((field) => `<td title="${escapeHtml(row[field] ?? '')}">${escapeHtml(truncate(String(row[field] ?? '—'), 45))}</td>`).join('')}
      <td><button class="btn-sm-roxo me-1" onclick="openEdit('${table}', ${Number(row._id)})"><i class="bi bi-pencil-fill"></i> Editar</button><button class="btn-sm-danger" onclick="confirmDelete('${table}', ${Number(row._id)})"><i class="bi bi-trash-fill"></i></button></td>
    </tr>`).join('');
  }

  window.openEdit = function openEdit(table, id) {
    const row = getRows(table).find((item) => String(item._id) === String(id));
    const form = formFor(table);
    if (!row || !form) return;
    if (form.elements.id) form.elements.id.value = row._id;
    (schemas[table] || []).forEach((field) => {
      const control = form.elements.namedItem(field);
      if (control) control.value = row[field] ?? '';
    });
    const button = form.querySelector('button[type="submit"]');
    if (button) button.innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Atualizar registro';
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    form.querySelector('input:not([type="hidden"]), textarea, select')?.focus({ preventScroll: true });
  };

  window.confirmDelete = function confirmDelete(table, id) {
    const form = formFor(table);
    const selectedId = id || form?.elements.id?.value;
    if (!selectedId) return showToast('Clique em Editar para selecionar um registro antes de excluir.', 'danger');
    state.deleteCtx = { table, id: selectedId };
    deleteModal?.show();
  };

  window.doDelete = async function doDelete() {
    if (!state.deleteCtx) return;
    const { table, id } = state.deleteCtx;
    try {
      if (table === '_admins') {
        await apiFetch(`/admins/${encodeURIComponent(id)}`, { method: 'DELETE' });
        await loadAdmins();
      } else {
        await apiFetch(`/cms/${table}/${encodeURIComponent(id)}`, { method: 'DELETE' });
        DB[table] = getRows(table).filter((row) => String(row._id) !== String(id));
        resetContentForm(table);
        renderTable(table);
      }
      showToast('Registro excluído!', 'danger');
    } catch (error) {
      showToast(error.message || 'Não foi possível excluir o registro.', 'danger');
    } finally {
      state.deleteCtx = null;
      deleteModal?.hide();
    }
  };

  window.saveEdit = function saveEdit() {
    // A edição é gravada no formulário superior, conforme o fluxo do CMS.
    document.getElementById('modal-edit')?.querySelector('[data-bs-dismiss="modal"]')?.click();
  };

  window.handleAdminSubmit = async function handleAdminSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('admin-form-id').value;
    const nome = document.getElementById('af-nome').value.trim();
    const email = document.getElementById('af-email').value.trim();
    const usuario = document.getElementById('af-usuario').value.trim();
    const perfil = document.getElementById('af-perfil').value;
    const senha = document.getElementById('af-senha').value;
    const senha2 = document.getElementById('af-senha2').value;
    const status = document.getElementById('af-status').value;
    if (!nome || !email || !usuario) return showToast('Preencha nome, e-mail e usuário.', 'danger');
    if (!id && !senha) return showToast('Informe uma senha.', 'danger');
    if (senha && senha !== senha2) return showToast('As senhas não conferem!', 'danger');
    if (senha && senha.length < 8) return showToast('Mínimo 8 caracteres.', 'danger');
    try {
      await apiFetch(id ? `/admins/${id}` : '/admins', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify({ nome, email, usuario, perfil, status, senha: senha || undefined }),
      });
      await loadAdmins();
      resetAdminForm();
      showToast(id ? 'Administrador atualizado!' : 'Administrador cadastrado!', 'success');
    } catch (error) {
      showToast(error.message || 'Não foi possível guardar o administrador.', 'danger');
    }
  };

  window.resetAdminForm = function resetAdminForm() {
    document.getElementById('admin-form-id').value = '';
    ['af-nome', 'af-email', 'af-usuario', 'af-senha', 'af-senha2'].forEach((id) => { document.getElementById(id).value = ''; });
    document.getElementById('af-perfil').value = 'admin';
    document.getElementById('af-status').value = 'active';
    document.getElementById('admin-form-btn').innerHTML = '<i class="bi bi-person-plus-fill me-1"></i>Cadastrar Administrador';
    document.getElementById('pw-bar').className = 'pw-bar';
    document.getElementById('pw-hint').textContent = '';
  };

  window.editAdmin = function editAdmin(id) {
    const admin = getRows('_admins').find((item) => String(item._id) === String(id));
    if (!admin) return;
    document.getElementById('admin-form-id').value = admin._id;
    document.getElementById('af-nome').value = admin.admin_nome || '';
    document.getElementById('af-email').value = admin.admin_email || '';
    document.getElementById('af-usuario').value = admin.admin_usuario || admin.admin_email || '';
    document.getElementById('af-perfil').value = admin.admin_perfil || 'admin';
    document.getElementById('af-status').value = admin.admin_status || 'active';
    document.getElementById('af-senha').value = '';
    document.getElementById('af-senha2').value = '';
    document.getElementById('admin-form-btn').innerHTML = '<i class="bi bi-floppy-fill me-1"></i>Salvar Alterações';
    document.getElementById('pw-hint').textContent = 'Deixe em branco para manter a senha atual.';
    document.querySelector('#page-admins .admin-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  window.deleteAdmin = function deleteAdmin(id) {
    if (String(id) === String(state.user?._id)) return showToast('Não é possível excluir a própria conta!', 'danger');
    state.deleteCtx = { table: '_admins', id };
    deleteModal?.show();
  };

  window.renderAdmins = function renderAdmins() {
    const search = (document.getElementById('admin-search')?.value || '').toLowerCase();
    const perfil = document.getElementById('admin-filter-perfil')?.value || '';
    const status = document.getElementById('admin-filter-status')?.value || '';
    let list = getRows('_admins');
    if (search) list = list.filter((admin) => `${admin.admin_nome}${admin.admin_email}${admin.admin_usuario}`.toLowerCase().includes(search));
    if (perfil) list = list.filter((admin) => admin.admin_perfil === perfil);
    if (status) list = list.filter((admin) => admin.admin_status === status);
    const isSuper = state.user?.admin_perfil === 'super';
    const grid = document.getElementById('admin-grid');
    if (grid) grid.innerHTML = list.length ? list.map((admin) => {
      const role = roleLabels[admin.admin_perfil] || { label: admin.admin_perfil, cls: 'role-viewer' };
      const initials = (admin.admin_nome || admin.admin_email).split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase();
      const isMe = String(admin._id) === String(state.user?._id);
      return `<div class="col-md-4 col-sm-6"><div class="user-card"><div class="d-flex align-items-center gap-2 mb-2"><div class="avatar">${escapeHtml(initials)}</div><div class="overflow-hidden"><div class="user-card-name">${escapeHtml(admin.admin_nome)}${isMe ? ' <span class="badge" style="background:var(--roxo);font-size:9px">você</span>' : ''}</div><div class="user-card-email">${escapeHtml(admin.admin_email)}</div></div></div><div class="text-muted" style="font-size:12px">@${escapeHtml(admin.admin_usuario || admin.admin_email)}</div><div class="user-card-footer"><div><span class="role-badge ${role.cls}">${role.label}</span><span style="font-size:12px;margin-left:6px"><span class="status-dot ${admin.admin_status}"></span>${admin.admin_status === 'active' ? 'Ativo' : 'Inativo'}</span></div>${isSuper ? `<div class="d-flex gap-1"><button class="btn-sm-roxo" onclick="editAdmin(${Number(admin._id)})"><i class="bi bi-pencil-fill"></i></button><button class="btn-sm-danger" onclick="deleteAdmin(${Number(admin._id)})" ${isMe ? 'disabled' : ''}><i class="bi bi-trash-fill"></i></button></div>` : ''}</div></div></div>`;
    }).join('') : '<div class="col-12 text-muted">Nenhum administrador encontrado.</div>';

    const tbody = document.getElementById('tb-admins');
    if (tbody) tbody.innerHTML = list.length ? list.map((admin, index) => {
      const role = roleLabels[admin.admin_perfil] || { label: admin.admin_perfil, cls: 'role-viewer' };
      const isMe = String(admin._id) === String(state.user?._id);
      return `<tr><td>${index + 1}</td><td>${escapeHtml(admin.admin_nome)}${isMe ? ' <span class="badge" style="background:var(--roxo);font-size:9px">você</span>' : ''}</td><td><code style="background:var(--roxo-pale);padding:2px 7px;border-radius:4px;font-size:12px;color:var(--roxo)">@${escapeHtml(admin.admin_usuario || admin.admin_email)}</code></td><td>${escapeHtml(admin.admin_email)}</td><td><span class="role-badge ${role.cls}">${role.label}</span></td><td><span class="status-dot ${admin.admin_status}"></span>${admin.admin_status === 'active' ? 'Ativo' : 'Inativo'}</td><td style="font-size:12px;color:#999">${formatDate(admin._created)}</td><td>${isSuper ? `<div class="d-flex gap-1"><button class="btn-sm-roxo" onclick="editAdmin(${Number(admin._id)})"><i class="bi bi-pencil-fill"></i> Editar</button><button class="btn-sm-danger" onclick="deleteAdmin(${Number(admin._id)})" ${isMe ? 'disabled' : ''}><i class="bi bi-trash-fill"></i></button></div>` : '<span class="text-muted">—</span>'}</td></tr>`;
    }).join('') : '<tr><td colspan="8" class="text-center text-muted py-3">Nenhum registro</td></tr>';
  };

  window.renderAdminStats = function renderAdminStats() {
    const admins = getRows('_admins');
    const container = document.getElementById('admin-stats');
    if (!container) return;
    const card = (icon, label, value, color) => `<div class="col-6 col-md-3"><div class="stat-card"><div class="stat-icon">${icon}</div><div class="stat-value" style="color:${color}">${value}</div><div class="stat-label">${label}</div></div></div>`;
    container.innerHTML = card('<i class="bi bi-people-fill" style="color:var(--roxo)"></i>', 'Total', admins.length, 'var(--roxo)') + card('<i class="bi bi-check-circle-fill" style="color:#198754"></i>', 'Ativos', admins.filter((admin) => admin.admin_status === 'active').length, '#198754') + card('<i class="bi bi-shield-fill" style="color:var(--dourado)"></i>', 'Super Admins', admins.filter((admin) => admin.admin_perfil === 'super').length, 'var(--dourado)') + card('<i class="bi bi-pencil-fill" style="color:#5a7fcc"></i>', 'Editores', admins.filter((admin) => admin.admin_perfil === 'editor').length, '#5a7fcc');
  };

  window.checkStrength = function checkStrength(input) {
    const value = input.value;
    const bar = document.getElementById('pw-bar');
    const hint = document.getElementById('pw-hint');
    let strength = 0;
    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;
    bar.className = `pw-bar${strength ? ` s${strength}` : ''}`;
    hint.textContent = value.length ? ['', 'Fraca', 'Razoável', 'Boa', 'Forte ✓'][strength] : '';
  };

  window.togglePw = function togglePw(id, button) {
    const input = document.getElementById(id);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    button.innerHTML = input.type === 'password' ? '<i class="bi bi-eye"></i>' : '<i class="bi bi-eye-slash"></i>';
  };

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('pt-BR');
  }

  window.closeModal = (id) => document.getElementById(id)?.querySelector('[data-bs-dismiss="modal"]')?.click();
  window.showToast = (message, type = 'success') => {
    const element = document.getElementById('main-toast');
    if (!element) return;
    element.className = `toast align-items-center text-white border-0 bg-${type === 'success' ? 'success' : type === 'danger' ? 'danger' : 'secondary'}`;
    document.getElementById('toast-msg').textContent = message;
    bootstrap.Toast.getOrCreateInstance(element, { delay: 2800 }).show();
  };

  document.addEventListener('DOMContentLoaded', () => {
    deleteModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modal-delete'));
    restoreSession();
  });
})();
