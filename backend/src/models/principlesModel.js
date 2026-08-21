const pool = require('../database/connection');

// Busca todos os registros da tabela about_principles
async function getAllPrinciples() {
    const [rows] = await pool.query('SELECT * FROM about_principles');
    return rows;
}

// Busca um registro específico pelo id_principle
async function getPrincipleById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM about_principles WHERE id_principle = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createPrinciple(icon, text, title, id_user) {
    const [result] = await pool.query(
        'INSERT INTO about_principles (icon, text, title, id_user) VALUES (?, ?, ?, ?)',
        [icon, text, title, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updatePrinciple(id, icon, text, title) {
    const [result] = await pool.query(
        'UPDATE about_principles SET icon = ?, text = ?, title = ? WHERE id_principle = ?',
        [icon, text, title, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deletePrinciple(id) {
    const [result] = await pool.query(
        'DELETE FROM about_principles WHERE id_principle = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllPrinciples,
    getPrincipleById,
    createPrinciple,
    updatePrinciple,
    deletePrinciple
};
