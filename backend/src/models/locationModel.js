const pool = require('../database/connection');

// Busca todos os registros da tabela contact_location
async function getAllLocation() {
    const [rows] = await pool.query('SELECT * FROM contact_location');
    return rows;
}

// Busca um registro específico pelo id_location
async function getLocationById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM contact_location WHERE id_location = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createLocation(maps_url, address, id_user) {
    const [result] = await pool.query(
        'INSERT INTO contact_location (maps_url, address, id_user) VALUES (?, ?, ?)',
        [maps_url, address, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateLocation(id, maps_url, address) {
    const [result] = await pool.query(
        'UPDATE contact_location SET maps_url = ?, address = ? WHERE id_location = ?',
        [maps_url, address, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteLocation(id) {
    const [result] = await pool.query(
        'DELETE FROM contact_location WHERE id_location = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllLocation,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
};