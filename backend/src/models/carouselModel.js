const pool = require('../database/connection');

// Busca todos os registros da tabela home_carousel
async function getAllCarousel() {
    const [rows] = await pool.query('SELECT * FROM home_carousel');
    return rows;
}

// Busca um registro específico pelo id_carousel
async function getCarouselById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM home_carousel WHERE id_carousel = ?',
        [id]
    );
    return rows[0];
}

// Insere um novo registro
async function createCarousel(title, description, background_image, id_user) {
    const [result] = await pool.query(
        'INSERT INTO home_carousel (title, description, background_image, id_user) VALUES (?, ?, ?, ?)',
        [title, description, background_image, id_user]
    );
    return result.insertId;
}

// Atualiza um registro existente
async function updateCarousel(id, title, description, background_image) {
    const [result] = await pool.query(
        'UPDATE home_carousel SET title = ?, description = ?, background_image = ? WHERE id_carousel = ?',
        [title, description, background_image, id]
    );
    return result.affectedRows;
}

// Remove um registro
async function deleteCarousel(id) {
    const [result] = await pool.query(
        'DELETE FROM home_carousel WHERE id_carousel = ?',
        [id]
    );
    return result.affectedRows;
}

module.exports = {
    getAllCarousel,
    getCarouselById,
    createCarousel,
    updateCarousel,
    deleteCarousel
};
