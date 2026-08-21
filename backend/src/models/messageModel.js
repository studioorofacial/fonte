const pool = require('../database/connection');

// Busca todos os registros da tabela contact_message
async function getAllMessage() {
    const [rows] = await pool.query('SELECT * FROM contact_message');
    return rows;
}

// Busca um registro específico pelo id_message
async function getMessageById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM contact_message WHERE id_message = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createMessage(message, email, name, id_user) {
    const [result] = await pool.query(
        'INSERT INTO contact_message (message, email, name, id_user) VALUES (?, ?, ?, ?)',
        [message, email, name, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateMessage(id, message, email, name) {
    const [result] = await pool.query(
        'UPDATE contact_message SET message = ?, email = ?, name = ? WHERE id_message = ?',
        [message, email, name, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteMessage(id) {
    const [result] = await pool.query(
        'DELETE FROM contact_message WHERE id_message = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllMessage,
    getMessageById,
    createMessage,
    updateMessage,
    deleteMessage
};