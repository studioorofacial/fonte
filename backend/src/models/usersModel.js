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

// Atualiza dados cadastrais do usuário (não mexe na senha)
async function updateUser(id, name, email, login, phone, role_id, status) {
    const [result] = await pool.query(
        'UPDATE users SET name = ?, email = ?, login = ?, phone = ?, role_id = ?, status = ? WHERE id_user = ?',
        [name, email, login, phone, role_id, status, id]
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

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    getUserByLogin,
    createUser,
    updateUser,
    updateUserPassword,
    deleteUser,
    getActiveUsersEmails
};
