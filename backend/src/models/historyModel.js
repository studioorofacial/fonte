const pool = require('../database/connection');

// Busca todos os registros da tabela about_history
async function getAllHistory() {
    const [rows] = await pool.query('SELECT * FROM about_history');
    return rows;
}

// Busca um registro específico pelo id_history
async function getHistoryById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM about_history WHERE id_history = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createHistory(title, text, image, id_user) {
    const [result] = await pool.query(
        'INSERT INTO about_history (title, text, image, id_user) VALUES (?, ?, ?, ?)',
        [title, text, image, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateHistory(id, title, text, image) {
    const [result] = await pool.query(
        'UPDATE about_history SET title = ?, text = ?, image = ? WHERE id_history = ?',
        [title, text, image, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteHistory(id) {
    const [result] = await pool.query(
        'DELETE FROM about_history WHERE id_history = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllHistory,
    getHistoryById,
    createHistory,
    updateHistory,
    deleteHistory
};