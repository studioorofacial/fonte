(() => {
  const API_BASE = window.CMS_API_BASE || (
    location.protocol === 'file:' || location.hostname.endsWith('github.io')
      ? 'http://localhost:6000/api'
      : '/api'
  );

  async function request(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers, credentials: 'include' });
    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : null;
    if (!response.ok) throw new Error(data?.error || `Erro HTTP ${response.status}`);
    return data;
  }

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));
  const first = (rows) => Array.isArray(rows) ? rows[0] : null;
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value !== undefined && value !== null) element.textContent = value;
  };

  async function renderHome() {
    const [mainRows, carouselRows, infoRows] = await Promise.all([
      request('/cms/home_main'), request('/cms/home_carousel'), request('/cms/home_info'),
    ]);
    const main = first(mainRows);
    if (main) {
      setText('.page-title h1', main.home_Titulo);
      setText('.page-title p', main.home_subtitulo);
    }
    const carousel = document.querySelector('#carouselExampleCaptions');
    if (carousel && carouselRows?.length) {
      const indicators = carousel.querySelector('.carousel-indicators');
      const inner = carousel.querySelector('.carousel-inner');
      if (indicators && inner) {
        indicators.innerHTML = carouselRows.map((row, index) => `<button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="Slide ${index + 1}"></button>`).join('');
        inner.innerHTML = carouselRows.map((row, index) => `<div class="carousel-item${index === 0 ? ' active' : ''}"><img src="${escapeHtml(row.Image_Backgroud)}" class="d-block w-100" alt="${escapeHtml(row.Image_Titulo || 'Imagem do slide')}"><div class="carousel-caption d-none d-md-block"><h5>${escapeHtml(row.Image_Titulo)}</h5><p>${escapeHtml(row.Image_Descricao)}</p></div></div>`).join('');
      }
    }
    document.querySelectorAll('.homebox').forEach((box, index) => {
      const row = infoRows?.[index];
      if (!row) return;
      const paragraph = box.querySelector('.homebox-text p');
      const image = box.querySelector('.homebox-img img');
      if (paragraph) paragraph.textContent = row.info_texto || '';
      if (image && row.info_image) {
        image.src = row.info_image;
        image.alt = 'Imagem informativa do Studio Orofacial';
      }
    });
  }

  function catalogCard(row, index) {
    const modalId = `cms-modal-${row._id || index}`;
    return `<section class="homeleft"><div class="contact-form"><h2><i class="bi bi-envelope"></i>${escapeHtml(row.item_catalogo_titulo)}</h2><div class="form-group"><p>${escapeHtml(row.item_catalogo_descricao_curta)}</p></div></div><div class="form-buttons"><button type="button" class="btn-clear" data-bs-toggle="modal" data-bs-target="#${modalId}"><i class="bi bi-send"></i> Saiba Mais</button><div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}-label" aria-hidden="true"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h1 class="modal-title fs-5" id="${modalId}-label">${escapeHtml(row.item_catalogo_titulo)}</h1><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div><div class="modal-body"><p>${escapeHtml(row.item_catalogo_descricao_modal || row.item_catalogo_descricao_curta)}</p></div><div class="modal-footer"><button type="button" class="btn btn-clear" data-bs-dismiss="modal">Fechar</button></div></div></div></div></div></div></section>`;
  }

  async function renderCatalog() {
    const [mainRows, items] = await Promise.all([request('/cms/catalogo_main'), request('/cms/item_catalogo')]);
    const main = first(mainRows);
    if (main) {
      setText('.page-title h1', main.catalogo_Titulo);
      setText('.page-title p', main.catalogo_subtitulo);
    }
    const list = document.getElementById('catalogo-lista');
    if (!list || !items?.length) return;
    let html = '';
    for (let index = 0; index < items.length; index += 2) {
      html += `<div class="catalogo-container">${items.slice(index, index + 2).map((item, offset) => catalogCard(item, index + offset)).join('')}</div>`;
    }
    list.innerHTML = html;
  }

  function iconMarkup(value) {
    const icon = String(value || '').trim();
    if (!icon) return '<i class="bi bi-stars"></i>';
    if (/^https?:\/\//i.test(icon)) return `<img src="${escapeHtml(icon)}" alt="" style="max-width:32px;max-height:32px">`;
    if (/^(bi|fas|far|fa)\s/.test(icon)) return `<i class="${escapeHtml(icon)}"></i>`;
    return escapeHtml(icon);
  }

  async function renderAbout() {
    const [mainRows, histories, principles, team, differentials] = await Promise.all([
      request('/cms/sobre_main'), request('/cms/historia'), request('/cms/principios'),
      request('/cms/equipe'), request('/cms/diferenciais'),
    ]);
    const main = first(mainRows);
    if (main) {
      setText('.page-title h1', main.sobre_Titulo);
      setText('.page-title p', main.sobre_subtitulo);
    }
    const history = first(histories);
    const historyContent = document.querySelector('.sobre-historia .sobre-content');
    if (history && historyContent) historyContent.innerHTML = `<p>${escapeHtml(history.Historia_texto)}</p>${history.Historia_Image ? `<div class="sobre-img-container"><img src="${escapeHtml(history.Historia_Image)}" alt="${escapeHtml(history.Historia_titulo || 'História do Studio Orofacial')}" class="sobre-imagem"></div>` : ''}`;
    const principleGrid = document.querySelector('.mvv-grid');
    if (principleGrid && principles?.length) principleGrid.innerHTML = principles.map((row) => `<div class="mvv-item"><div class="mvv-icon">${iconMarkup(row.principios_icone)}</div><h3>${escapeHtml(row.principios_titulo)}</h3><p>${escapeHtml(row.principios_texto)}</p></div>`).join('');
    const teamGrid = document.querySelector('.equipe-grid');
    if (teamGrid && team?.length) teamGrid.innerHTML = team.map((row) => `<div class="equipe-item"><div class="equipe-img">${iconMarkup(row.equipe_image)}</div><h3>${escapeHtml(row.equipe_especialista)}</h3><p class="equipe-cargo">${escapeHtml(row.equipe_universidade)}</p><p class="equipe-desc">${escapeHtml(row.equipe_formacao)}</p></div>`).join('');
    const differentialList = document.querySelector('.diferenciais-list');
    if (differentialList && differentials?.length) differentialList.innerHTML = differentials.map((row) => `<div class="diferencial-item"><i class="bi bi-check-circle"></i><span>${escapeHtml(row.Diferenciais_descricao)}</span></div>`).join('');
  }

  async function renderContact() {
    const [mainRows, locations, infos] = await Promise.all([request('/cms/contato_main'), request('/cms/localizacao'), request('/cms/contato_info')]);
    const main = first(mainRows);
    if (main) {
      setText('.page-title h1', main.contato_titulo);
      setText('.page-title p', main.contato_subtitulo);
    }
    const location = first(locations);
    if (location) {
      const frame = document.querySelector('.map-frame iframe');
      if (frame && location.localizacao_maps) frame.src = location.localizacao_maps;
      const address = document.querySelector('.address-info');
      if (address) address.innerHTML = `<h3><i class="bi bi-building"></i> Endereço</h3><p>${escapeHtml(location.localizacao_endereco || '')}</p>`;
    }
    const info = first(infos);
    if (info) {
      const box = document.querySelector('.contact-info');
      if (box) box.innerHTML = `<h3><i class="bi bi-info-circle"></i> Outras formas de contato:</h3><p><i class="bi bi-telephone"></i> Telefone: ${escapeHtml(info.contato_info_telefone || '')}</p><p><i class="bi bi-whatsapp"></i> WhatsApp: ${escapeHtml(info.contato_info_whatsapp || '')}</p><p><i class="bi bi-clock"></i> Horário de atendimento: ${escapeHtml(info.contato_info_texto_atendimento || '')}</p>`;
    }
  }

  async function bindContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const original = button?.textContent;
      if (button) { button.disabled = true; button.textContent = 'Enviando...'; }
      try {
        await request('/contact/messages', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
        form.reset();
        window.alert('Mensagem enviada com sucesso.');
      } catch (error) {
        window.alert(error.message || 'Não foi possível enviar a mensagem.');
      } finally {
        if (button) { button.disabled = false; button.textContent = original; }
      }
    });
  }

  window.limparFormulario = () => document.getElementById('contactForm')?.reset();

  document.addEventListener('DOMContentLoaded', async () => {
    const tasks = [];
    if (document.querySelector('#carouselExampleCaptions')) tasks.push(renderHome());
    if (document.getElementById('catalogo-lista')) tasks.push(renderCatalog());
    if (document.querySelector('.sobre-container')) tasks.push(renderAbout());
    if (document.querySelector('.contact-container')) tasks.push(renderContact());
    tasks.push(bindContactForm());
    const results = await Promise.allSettled(tasks);
    const failure = results.find((result) => result.status === 'rejected');
    if (failure) console.error('Não foi possível carregar o conteúdo do CMS:', failure.reason);
  });
})();
