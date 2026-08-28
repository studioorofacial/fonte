const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const {
    listCarousel,
    showCarousel,
    storeCarousel,
    editCarousel,
    removeCarousel
} = require('../controllers/carouselControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

// ============================================================
// UPLOAD DE IMAGEM DO CAROUSEL
// ============================================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // __dirname = backend/src/routes
        // ../../..  -> raiz do projeto (PROJETO_INTEGRADOR)
        // depois entra em frontend/img
        cb(null, path.join(__dirname, '../../../frontend/img'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas imagens são permitidas.'));
        }
        cb(null, true);
    }
});

router.post(
    '/upload-carousel',
    authenticate,
    authorize(1, 2), // só root e admin podem subir imagem do carousel; secretaria (3) fica de fora
    (req, res) => {
        upload.single('imagem')(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }
            res.json({ path: `img/${req.file.filename}` });
        });
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