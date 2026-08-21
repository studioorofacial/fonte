const pool = require('../database/connection');

// Busca todos os registros da tabela tokens
async function getAllTokens() {
    const [rows] = await pool.query('SELECT * FROM tokens');
    return rows;
}

// Busca um registro específico pelo id_token
async function getTokenById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM tokens WHERE id_token = ?',
        [id]
    );
    return rows[0];
}

// Busca um token específico pelo valor do token (útil para validar login)
async function getByTokenValue(token) {
    const [rows] = await pool.query(
        'SELECT * FROM tokens WHERE token = ?',
        [token]
    );
    return rows[0];
}

// Insere um novo registro
async function createToken(token, expires_at, id_user) {
    const [result] = await pool.query(
        'INSERT INTO tokens (token, expires_at, id_user) VALUES (?, ?, ?)',
        [token, expires_at, id_user]
    );
    return result.insertId;
}

// Remove um registro (ex: logout ou expiração)
async function deleteToken(id) {
    const [result] = await pool.query(
        'DELETE FROM tokens WHERE id_token = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllTokens,
    getTokenById,
    getByTokenValue,
    createToken,
    deleteToken
};