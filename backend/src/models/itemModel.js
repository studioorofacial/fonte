const pool = require('../database/connection');

// Busca todos os registros da tabela catalog_item
async function getAllItem() {
    const [rows] = await pool.query('SELECT * FROM catalog_item');
    return rows;
}

// Busca um registro específico pelo id_item
async function getItemById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM catalog_item WHERE id_item = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createItem(title, short_description, modal_description, id_user) {
    const [result] = await pool.query(
        'INSERT INTO catalog_item (title, short_description, modal_description, id_user) VALUES (?, ?, ?, ?)',
        [title, short_description, modal_description, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateItem(id, title, short_description, modal_description) {
    const [result] = await pool.query(
        'UPDATE catalog_item SET title = ?, short_description = ?, modal_description = ? WHERE id_item = ?',
        [title, short_description, modal_description, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteItem(id) {
    const [result] = await pool.query(
        'DELETE FROM catalog_item WHERE id_item = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllItem,
    getItemById,
    createItem,
    updateItem,
    deleteItem
};
