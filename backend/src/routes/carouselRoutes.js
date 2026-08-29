const express = require('express');
const router = express.Router();
const {
    listCarousel,
    showCarousel,
    storeCarousel,
    editCarousel,
    removeCarousel
} = require('../controllers/carouselControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');
const { middlewareUpload } = require('../utils/uploadHelper');

// ============================================================
// UPLOAD DE IMAGEM DO CAROUSEL
// ============================================================
router.post(
    '/upload-carousel',
    authenticate,
    authorize(1, 2), // só root e admin podem subir imagem do carousel; secretaria (3) fica de fora
    middlewareUpload('imagem'),
    (req, res) => {
        res.json({ path: req.imagemPath });
    }
);

// ============================================================
// CRUD — HOME CAROUSEL
// ============================================================
router.get('/carousel', listCarousel);
router.get('/carousel/:id', showCarousel);
router.post('/carousel', authenticate, authorize(1, 2), storeCarousel);
router.put('/carousel/:id', authenticate, authorize(1, 2), editCarousel);
router.delete('/carousel/:id', authenticate, authorize(1, 2), removeCarousel);

module.exports = router;