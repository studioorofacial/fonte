const pool = require('../database/connection');

// Busca todos os registros da tabela main
async function getAllMain() {
    const [rows] = await pool.query('SELECT * FROM main');
    return rows;
}

// Busca um registro específico pelo id_main
async function getMainById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM main WHERE id_main = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createMain(title, subtitle, id_user) {
    const [result] = await pool.query(
        'INSERT INTO main (title, subtitle, id_user) VALUES (?, ?, ?)',
        [title, subtitle, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateMain(id, title, subtitle) {
    const [result] = await pool.query(
        'UPDATE main SET title = ?, subtitle = ? WHERE id_main = ?',
        [title, subtitle, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteMain(id) {
    const [result] = await pool.query(
        'DELETE FROM main WHERE id_main = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllMain,
    getMainById,
    createMain,
    updateMain,
    deleteMain
};