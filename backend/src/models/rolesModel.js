const pool = require('../database/connection');

// Busca todos os registros da tabela roles
async function getAllRoles() {
    const [rows] = await pool.query('SELECT * FROM roles');
    return rows;
}

// Busca um registro específico pelo id_role
async function getRoleById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM roles WHERE id_role = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createRole(name_role) {
    const [result] = await pool.query(
        'INSERT INTO roles (name_role) VALUES (?)',
        [name_role]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateRole(id, name_role) {
    const [result] = await pool.query(
        'UPDATE roles SET name_role = ? WHERE id_role = ?',
        [name_role, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteRole(id) {
    const [result] = await pool.query(
        'DELETE FROM roles WHERE id_role = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};