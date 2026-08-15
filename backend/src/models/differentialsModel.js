const pool = require('../database/connection');

// Busca TODOS os registros da tabela about_differentials
async function getAllDifferentials() {
  const [rows] = await pool.query('SELECT * FROM about_differentials');
  return rows;
}


// Busca UM registro específico pelo id_differential
async function getDifferentialById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM about_differentials WHERE id_differential = ?',
    [id]
  );
  return rows[0];
}


// Insere um novo registro na tabela
async function createDifferential(description, id_user) {
  const [result] = await pool.query(
    'INSERT INTO about_differentials (description, id_user) VALUES (?, ?)',
    [description, id_user]
  );
  return result.insertId; // retorna o id do registro criado
}


// Atualiza a descrição de um registro existente
async function updateDifferential(id, description) {
  const [result] = await pool.query(
    'UPDATE about_differentials SET description = ? WHERE id_differential = ?',
    [description, id]
  );
  return result.affectedRows; // quantas linhas foram alteradas
}


// Remove um registro pelo id_differential
async function deleteDifferential(id) {
  const [result] = await pool.query(
    'DELETE FROM about_differentials WHERE id_differential = ?',
    [id]
  );
  return result.affectedRows;
}

module.exports = {
  getAllDifferentials,
  getDifferentialById,
  createDifferential,
  updateDifferential,
  deleteDifferential
};