const pool = require('../database/connection');

// Busca todos os registros da tabela about_team
async function getAllTeam() {
    const [rows] = await pool.query('SELECT * FROM about_team');
    return rows;
}

// Busca um registro específico pelo id_team
async function getTeamById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM about_team WHERE id_team = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createTeam(specialist, university, education, image, id_user) {
    const [result] = await pool.query(
        'INSERT INTO about_team (specialist, university, education, image, id_user) VALUES (?, ?, ?, ?, ?)',
        [specialist, university, education, image, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateTeam(id, specialist, university, education, image) {
    const [result] = await pool.query(
        'UPDATE about_team SET specialist = ?, university = ?, education = ?, image = ? WHERE id_team = ?',
        [specialist, university, education, image, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteTeam(id) {
    const [result] = await pool.query(
        'DELETE FROM about_team WHERE id_team = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllTeam,
    getTeamById,
    createTeam,
    updateTeam,
    deleteTeam
};