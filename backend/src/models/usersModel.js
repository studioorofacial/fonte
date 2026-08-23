const pool = require('../database/connection');

// Busca todos os usuários (nunca retorna a senha)
async function getAllUsers() {
    const [rows] = await pool.query(
        'SELECT id_user, name, email, login, phone, role_id, status, created_at, updated_at FROM users'
    );
    return rows;
}

// Busca um usuário pelo id (nunca retorna a senha)
async function getUserById(id) {
    const [rows] = await pool.query(
        'SELECT id_user, name, email, login, phone, role_id, status, created_at, updated_at FROM users WHERE id_user = ?',
        [id]
    );
    return rows[0];
}

// Busca um usuário pelo email, COM a senha (uso interno, exclusivo para o login)
async function getUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

// Busca um usuário pelo email OU pelo login (usado no login — o campo
// "Usuário ou e-mail" da tela aceita os dois)
async function getUserByEmailOrLogin(identificador) {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ? OR login = ?',
        [identificador, identificador]
    );
    return rows[0];
}

// Busca um usuário pelo login (usado pra checar duplicidade)
async function getUserByLogin(login) {
    const [rows] = await pool.query('SELECT * FROM users WHERE login = ?', [login]);
    return rows[0];
}

// Insere um novo usuário — a senha que chega aqui já deve estar em hash
async function createUser(name, email, login, hashedPassword, phone, role_id) {
    const [result] = await pool.query(
        'INSERT INTO users (name, email, login, password, phone, role_id) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, login, hashedPassword, phone, role_id]
    );
    return result.insertId;
}

// Atualiza dados cadastrais do usuário. email e login NÃO entram aqui de
// propósito: são fixos após a criação, só alteráveis direto no banco se
// um dia for realmente necessário.
async function updateUser(id, name, phone, role_id, status) {
    const [result] = await pool.query(
        'UPDATE users SET name = ?, phone = ?, role_id = ?, status = ? WHERE id_user = ?',
        [name, phone, role_id, status, id]
    );
    return result.affectedRows;
}

// Atualiza somente a senha (já deve chegar em hash)
async function updateUserPassword(id, hashedPassword) {
    const [result] = await pool.query(
        'UPDATE users SET password = ? WHERE id_user = ?',
        [hashedPassword, id]
    );
    return result.affectedRows;
}

// Remove um usuário
async function deleteUser(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id_user = ?', [id]);
    return result.affectedRows;
}

// Busca só os e-mails dos usuários ativos (status=1) — usado pra
// notificar todos os admins quando chega uma mensagem de contato
async function getActiveUsersEmails() {
    const [rows] = await pool.query(
        'SELECT email FROM users WHERE status = 1'
    );
    return rows.map(r => r.email);
}

// O "master" do sistema é o primeiro registro da tabela users — o
// superadmin original. Ele nunca pode ser excluído, por ninguém,
// nem por ele mesmo (diferente dos demais usuários Root, que podem
// excluir uns aos outros normalmente).
async function getMasterUserId() {
    const [rows] = await pool.query(
        'SELECT id_user FROM users ORDER BY id_user ASC LIMIT 1'
    );
    return rows[0]?.id_user;
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserByEmailOrLogin,
    getUserByLogin,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser,
    getActiveUsersEmails,
    getMasterUserId
};
