const crypto = require('node:crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const db = require('../database/connection');

const router = express.Router();
const SESSION_COOKIE = 'cms_token';
const JWT_SECRET = process.env.JWT_SECRET || 'troque-esta-chave-em-producao';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

// O frontend usa estes nomes; os valores são as colunas reais do schema main-v2.
const ENTITIES = {
  home_main: {
    table: 'main', primaryKey: 'id_main', pageKey: 'home',
    fields: { home_Titulo: 'title', home_subtitulo: 'subtitle' },
    required: ['title', 'subtitle'],
  },
  sobre_main: {
    table: 'main', primaryKey: 'id_main', pageKey: 'sobre',
    fields: { sobre_Titulo: 'title', sobre_subtitulo: 'subtitle' },
    required: ['title', 'subtitle'],
  },
  catalogo_main: {
    table: 'main', primaryKey: 'id_main', pageKey: 'catalogo',
    fields: { catalogo_Titulo: 'title', catalogo_subtitulo: 'subtitle' },
    required: ['title', 'subtitle'],
  },
  contato_main: {
    table: 'main', primaryKey: 'id_main', pageKey: 'contato',
    fields: { contato_titulo: 'title', contato_subtitulo: 'subtitle' },
    required: ['title', 'subtitle'],
  },
  home_carousel: {
    table: 'home_carousel', primaryKey: 'id_carousel',
    fields: { Image_Titulo: 'title', Image_Descricao: 'description', Image_Backgroud: 'background_image' },
    required: ['title', 'background_image'],
  },
  home_info: {
    table: 'home_info', primaryKey: 'id_info',
    fields: { info_texto: 'text', info_image: 'image' },
    required: ['text', 'image'],
  },
  historia: {
    table: 'about_history', primaryKey: 'id_history',
    fields: { Historia_titulo: 'title', Historia_texto: 'text', Historia_Image: 'image' },
    required: ['title', 'text', 'image'],
  },
  principios: {
    table: 'about_principles', primaryKey: 'id_principle',
    fields: { principios_titulo: 'title', principios_texto: 'text', principios_icone: 'icon' },
    required: ['title', 'text'],
  },
  equipe: {
    table: 'about_team', primaryKey: 'id_team',
    fields: { equipe_especialista: 'specialist', equipe_universidade: 'university', equipe_formacao: 'education', equipe_image: 'image' },
    required: ['specialist', 'university', 'education', 'image'],
  },
  diferenciais: {
    table: 'about_differentials', primaryKey: 'id_differential',
    fields: { Diferenciais_descricao: 'description' },
    required: ['description'],
  },
  item_catalogo: {
    table: 'catalog_item', primaryKey: 'id_item',
    fields: { item_catalogo_titulo: 'title', item_catalogo_descricao_curta: 'short_description', item_catalogo_descricao_modal: 'modal_description' },
    required: ['title', 'short_description'],
  },
  mensagem: {
    table: 'contact_message', primaryKey: 'id_message',
    fields: { mensagem_nome: 'name', mensagem_email: 'email', mensagem_texto: 'message' },
    required: ['name', 'email', 'message'],
  },
  localizacao: {
    table: 'contact_location', primaryKey: 'id_location',
    fields: { localizacao_maps: 'maps_url', localizacao_endereco: 'address' },
    required: ['address'],
  },
  contato_info: {
    table: 'contact_info', primaryKey: 'id_info',
    fields: { contato_info_telefone: 'phone', contato_info_whatsapp: 'whatsapp', contato_info_texto_atendimento: 'service_text' },
    required: ['whatsapp', 'service_text'],
  },
};

const ROLE_ALIASES = {
  super: ['root', 'super', 'super admin', 'superadmin'],
  admin: ['admin', 'administrator', 'administrador', 'secretaria'],
  editor: ['editor'],
  viewer: ['viewer', 'visualizador'],
};

function quoteIdentifier(identifier) {
  return `\`${String(identifier).replace(/`/g, '``')}\``;
}

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, item) => {
    const index = item.indexOf('=');
    if (index < 0) return cookies;
    cookies[item.slice(0, index).trim()] = decodeURIComponent(item.slice(index + 1).trim());
    return cookies;
  }, {});
}

function tokenFromRequest(req) {
  const authorization = req.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) return authorization.slice(7).trim();
  return parseCookies(req.headers.cookie)[SESSION_COOKIE];
}

function roleSlug(roleName = '') {
  const name = roleName.trim().toLowerCase();
  return Object.entries(ROLE_ALIASES).find(([, aliases]) => aliases.includes(name))?.[0] || name || 'viewer';
}

function isSuperAdmin(user) {
  return Number(user?.id_user) === 1 || roleSlug(user?.name_role) === 'super';
}

function publicUser(user) {
  const role = isSuperAdmin(user) ? 'super' : roleSlug(user.name_role);
  return {
    _id: user.id_user,
    admin_nome: user.name || '',
    admin_email: user.email,
    admin_usuario: user.email,
    admin_perfil: role,
    admin_status: user.status ? 'active' : 'inactive',
    _created: user.created_at,
  };
}

function isBcryptHash(value = '') {
  return /^\$2[aby]?\$\d{2}\$/.test(value);
}

async function findUserById(id) {
  const [rows] = await db.execute(
    `SELECT u.id_user, u.name, u.email, u.password, u.phone, u.status, u.created_at, r.name_role
       FROM users u INNER JOIN roles r ON r.id_role = u.role_id
      WHERE u.id_user = ? LIMIT 1`,
    [id],
  );
  return rows[0] || null;
}

async function findUserByToken(token) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.execute(
      `SELECT u.id_user, u.name, u.email, u.password, u.phone, u.status, u.created_at, r.name_role
         FROM tokens t INNER JOIN users u ON u.id_user = t.id_user INNER JOIN roles r ON r.id_role = u.role_id
        WHERE t.token = ? AND t.expires_at > NOW() AND u.status = 1 LIMIT 1`,
      [token],
    );
    if (!rows[0] || Number(rows[0].id_user) !== Number(payload.sub)) return null;
    return rows[0];
  } catch (_) {
    return null;
  }
}

async function requireAuth(req, res, next) {
  try {
    const user = await findUserByToken(tokenFromRequest(req));
    if (!user) return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function requireContentWrite(req, res, next) {
  if (!isSuperAdmin(req.user) && roleSlug(req.user.name_role) === 'viewer') return res.status(403).json({ error: 'O perfil atual não pode alterar conteúdo.' });
  next();
}

function requireSuper(req, res, next) {
  if (!isSuperAdmin(req.user)) return res.status(403).json({ error: 'Apenas Super Admin pode gerir administradores.' });
  next();
}

function getEntity(name) {
  return ENTITIES[name] || null;
}

function selectFields(entity) {
  const contentFields = Object.entries(entity.fields)
    .map(([apiName, dbName]) => `${quoteIdentifier(dbName)} AS ${quoteIdentifier(apiName)}`)
    .join(', ');
  return `${quoteIdentifier(entity.primaryKey)} AS _id, \`created_at\` AS _created${contentFields ? `, ${contentFields}` : ''}`;
}

function valuesFromBody(entity, body = {}) {
  const values = {};
  Object.entries(entity.fields).forEach(([apiName, dbName]) => {
    if (!Object.prototype.hasOwnProperty.call(body, apiName)) return;
    values[dbName] = typeof body[apiName] === 'string' ? body[apiName].trim() : body[apiName];
  });
  return values;
}

function validate(entity, values) {
  const missing = entity.required.filter((field) => values[field] === undefined || values[field] === null || values[field] === '');
  if (missing.length) {
    const error = new Error(`Campos obrigatórios: ${missing.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }
}

async function listEntity(entity) {
  const where = entity.pageKey ? ' WHERE page_key = ?' : '';
  const params = entity.pageKey ? [entity.pageKey] : [];
  const [rows] = await db.execute(
    `SELECT ${selectFields(entity)} FROM ${quoteIdentifier(entity.table)}${where} ORDER BY ${quoteIdentifier(entity.primaryKey)} DESC`,
    params,
  );
  return rows;
}

async function insertEntity(entity, body, userId) {
  const values = valuesFromBody(entity, body);
  validate(entity, values);
  const columns = Object.keys(values);
  const params = Object.values(values);
  if (entity.pageKey) {
    columns.push('page_key');
    params.push(entity.pageKey);
  }
  if (userId) {
    columns.push('id_user');
    params.push(userId);
  }
  const [result] = await db.execute(
    `INSERT INTO ${quoteIdentifier(entity.table)} (${columns.map(quoteIdentifier).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
    params,
  );
  return result.insertId;
}

async function updateEntity(entity, id, body) {
  const values = valuesFromBody(entity, body);
  validate(entity, values);
  const columns = Object.keys(values);
  if (!columns.length) {
    const error = new Error('Nenhum campo válido para atualizar.');
    error.statusCode = 400;
    throw error;
  }
  const [result] = await db.execute(
    `UPDATE ${quoteIdentifier(entity.table)} SET ${columns.map((column) => `${quoteIdentifier(column)} = ?`).join(', ')} WHERE ${quoteIdentifier(entity.primaryKey)} = ?${entity.pageKey ? ' AND page_key = ?' : ''}`,
    [...Object.values(values), id, ...(entity.pageKey ? [entity.pageKey] : [])],
  );
  if (!result.affectedRows) {
    const error = new Error('Registro não encontrado.');
    error.statusCode = 404;
    throw error;
  }
}

async function deleteEntity(entity, id) {
  const [result] = await db.execute(
    `DELETE FROM ${quoteIdentifier(entity.table)} WHERE ${quoteIdentifier(entity.primaryKey)} = ?${entity.pageKey ? ' AND page_key = ?' : ''}`,
    [id, ...(entity.pageKey ? [entity.pageKey] : [])],
  );
  if (!result.affectedRows) {
    const error = new Error('Registro não encontrado.');
    error.statusCode = 404;
    throw error;
  }
}

async function getRoleId(slug) {
  const aliases = ROLE_ALIASES[slug] || [slug];
  const [rows] = await db.execute(
    `SELECT id_role FROM roles WHERE LOWER(name_role) IN (${aliases.map(() => '?').join(', ')}) ORDER BY id_role LIMIT 1`,
    aliases,
  );
  if (rows[0]) return rows[0].id_role;
  const [created] = await db.execute('INSERT INTO roles (name_role) VALUES (?)', [slug]);
  return created.insertId;
}

async function listAdmins() {
  const [rows] = await db.query(
    `SELECT u.id_user, u.name, u.email, u.status, u.created_at, r.name_role
       FROM users u INNER JOIN roles r ON r.id_role = u.role_id ORDER BY u.id_user DESC`,
  );
  return rows.map(publicUser);
}

router.get('/health', (req, res) => res.json({ ok: true }));

router.post('/auth/login', async (req, res, next) => {
  try {
    const login = String(req.body?.login || '').trim();
    const password = String(req.body?.password || '');
    if (!login || !password) return res.status(400).json({ error: 'Login e senha são obrigatórios.' });
    const [rows] = await db.execute(
      `SELECT u.id_user, u.name, u.email, u.password, u.phone, u.status, u.created_at, r.name_role
         FROM users u INNER JOIN roles r ON r.id_role = u.role_id
        WHERE (u.email = ? OR u.name = ?) AND u.status = 1 LIMIT 1`,
      [login, login],
    );
    const user = rows[0];
    const valid = user && (isBcryptHash(user.password) ? await bcrypt.compare(password, user.password) : user.password === password);
    if (!valid) return res.status(401).json({ error: 'Usuário ou senha incorretos.' });

    if (!isBcryptHash(user.password)) {
      const migratedPassword = await bcrypt.hash(password, 12);
      await db.execute('UPDATE users SET password = ? WHERE id_user = ?', [migratedPassword, user.id_user]);
    }
    const token = jwt.sign({ sub: user.id_user }, JWT_SECRET, { expiresIn: SESSION_TTL_SECONDS });
    await db.execute(
      `INSERT INTO tokens (token, expires_at, id_user) VALUES (?, DATE_ADD(NOW(), INTERVAL 8 HOUR), ?)`,
      [token, user.id_user],
    );
    res.cookie(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: SESSION_TTL_SECONDS * 1000, path: '/' });
    res.json({ token, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/logout', async (req, res, next) => {
  try {
    const token = tokenFromRequest(req);
    if (token) await db.execute('DELETE FROM tokens WHERE token = ?', [token]);
    res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

router.get('/auth/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));

router.get('/cms', requireAuth, async (req, res, next) => {
  try {
    const entries = await Promise.all(Object.entries(ENTITIES).map(async ([name, entity]) => [name, await listEntity(entity)]));
    res.json(Object.fromEntries(entries));
  } catch (error) {
    next(error);
  }
});

router.get('/cms/:entity', async (req, res, next) => {
  const entity = getEntity(req.params.entity);
  if (!entity) return res.status(404).json({ error: 'Entidade do CMS não encontrada.' });
  if (req.params.entity === 'mensagem') return requireAuth(req, res, async (authError) => {
    if (authError) return next(authError);
    try { res.json(await listEntity(entity)); } catch (error) { next(error); }
  });
  try {
    res.json(await listEntity(entity));
  } catch (error) {
    next(error);
  }
});

router.post('/contact/messages', async (req, res, next) => {
  try {
    const id = await insertEntity(ENTITIES.mensagem, {
      mensagem_nome: req.body?.nome,
      mensagem_email: req.body?.email,
      mensagem_texto: req.body?.mensagem,
    }, null);
    res.status(201).json({ id_message: id, message: 'Mensagem enviada com sucesso.' });
  } catch (error) {
    next(error);
  }
});

router.post('/cms/:entity', requireAuth, requireContentWrite, async (req, res, next) => {
  const entity = getEntity(req.params.entity);
  if (!entity) return res.status(404).json({ error: 'Entidade do CMS não encontrada.' });
  try {
    const id = await insertEntity(entity, req.body, req.user.id_user);
    const rows = await listEntity(entity);
    res.status(201).json(rows.find((row) => String(row._id) === String(id)) || { _id: id });
  } catch (error) {
    next(error);
  }
});

router.put('/cms/:entity/:id', requireAuth, requireContentWrite, async (req, res, next) => {
  const entity = getEntity(req.params.entity);
  if (!entity) return res.status(404).json({ error: 'Entidade do CMS não encontrada.' });
  try {
    await updateEntity(entity, req.params.id, req.body);
    const rows = await listEntity(entity);
    res.json(rows.find((row) => String(row._id) === String(req.params.id)) || { _id: req.params.id });
  } catch (error) {
    next(error);
  }
});

router.delete('/cms/:entity/:id', requireAuth, requireContentWrite, async (req, res, next) => {
  const entity = getEntity(req.params.entity);
  if (!entity) return res.status(404).json({ error: 'Entidade do CMS não encontrada.' });
  try {
    await deleteEntity(entity, req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.get('/admins', requireAuth, requireSuper, async (req, res, next) => {
  try { res.json(await listAdmins()); } catch (error) { next(error); }
});

router.post('/admins', requireAuth, requireSuper, async (req, res, next) => {
  try {
    const { nome, email, perfil = 'admin', status = 'active', senha } = req.body || {};
    if (!nome || !email || !senha) return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    if (senha.length < 8) return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
    const roleId = await getRoleId(perfil);
    const [result] = await db.execute(
      `INSERT INTO users (name, email, password, phone, status, role_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [nome.trim(), email.trim(), await bcrypt.hash(senha, 12), 'Não informado', status === 'active' ? 1 : 0, roleId],
    );
    res.status(201).json({ _id: result.insertId });
  } catch (error) { next(error); }
});

router.put('/admins/:id', requireAuth, requireSuper, async (req, res, next) => {
  try {
    const { nome, email, perfil = 'admin', status = 'active', senha } = req.body || {};
    if (!nome || !email) return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    const roleId = await getRoleId(perfil);
    const params = [nome.trim(), email.trim(), roleId, status === 'active' ? 1 : 0];
    let passwordSql = '';
    if (senha) {
      if (senha.length < 8) return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres.' });
      passwordSql = ', password = ?';
      params.push(await bcrypt.hash(senha, 12));
    }
    params.push(req.params.id);
    const [result] = await db.execute(`UPDATE users SET name = ?, email = ?, role_id = ?, status = ?${passwordSql} WHERE id_user = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ error: 'Administrador não encontrado.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

router.delete('/admins/:id', requireAuth, requireSuper, async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user.id_user)) return res.status(400).json({ error: 'Não é possível excluir a própria conta.' });
    const [result] = await db.execute('DELETE FROM users WHERE id_user = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: 'Administrador não encontrado.' });
    res.status(204).end();
  } catch (error) { next(error); }
});

module.exports = router;
