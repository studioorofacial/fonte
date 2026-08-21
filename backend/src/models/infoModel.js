const pool = require('../database/connection');

// Busca todos os registros da tabela contact_info
async function getAllInfo() {
    const [rows] = await pool.query('SELECT * FROM contact_info');
    return rows;
}

// Busca um registro específico pelo id_info
async function getInfoById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM contact_info WHERE id_info = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createInfo(service_text, whatsapp, phone, id_user) {
    const [result] = await pool.query(
        'INSERT INTO contact_info (service_text, whatsapp, phone, id_user) VALUES (?, ?, ?, ?)',
        [service_text, whatsapp, phone, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateInfo(id, service_text, whatsapp, phone) {
    const [result] = await pool.query(
        'UPDATE contact_info SET service_text = ?, whatsapp = ?, phone = ? WHERE id_info = ?',
        [service_text, whatsapp, phone, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteInfo(id) {
    const [result] = await pool.query(
        'DELETE FROM contact_info WHERE id_info = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllInfo,
    getInfoById,
    createInfo,
    updateInfo,
    deleteInfo
};