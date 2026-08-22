const pool = require('../database/connection');

// Busca todos os registros da tabela home_info
async function getAllHomeInfo() {
    const [rows] = await pool.query('SELECT * FROM home_info');
    return rows;
}

// Busca um registro específico pelo id_info
async function getHomeInfoById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM home_info WHERE id_info = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createHomeInfo(text, image, id_user) {
    const [result] = await pool.query(
        'INSERT INTO home_info (text, image, id_user) VALUES (?, ?, ?)',
        [text, image, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateHomeInfo(id, text, image) {
    const [result] = await pool.query(
        'UPDATE home_info SET text = ?, image = ? WHERE id_info = ?',
        [text, image, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteHomeInfo(id) {
    const [result] = await pool.query(
        'DELETE FROM home_info WHERE id_info = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllHomeInfo,
    getHomeInfoById,
    createHomeInfo,
    updateHomeInfo,
    deleteHomeInfo
};
