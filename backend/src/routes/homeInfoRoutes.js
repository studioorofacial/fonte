const express = require('express');
const router = express.Router();
const {
    listHomeInfo,
    showHomeInfo,
    storeHomeInfo,
    editHomeInfo,
    removeHomeInfo
} = require('../controllers/homeInfoControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');
const { middlewareUpload } = require('../utils/uploadHelper');

// ============================================================
// UPLOAD DE IMAGEM DO HOME INFO
// ============================================================
router.post(
    '/upload-home-info',
    authenticate,
    authorize(1, 2), // só root e admin podem subir imagem; secretária (3) fica de fora
    middlewareUpload('imagem'),
    (req, res) => {
        res.json({ path: req.imagemPath });
    }
);

// Rota é /api/home-info (diferente de /api/info, que já é usada
// pela tabela contact_info)
router.get('/home-info', listHomeInfo);
router.get('/home-info/:id', showHomeInfo);
router.post('/home-info', authenticate, authorize(1, 2), storeHomeInfo);
router.put('/home-info/:id', authenticate, authorize(1, 2), editHomeInfo);
router.delete('/home-info/:id', authenticate, authorize(1, 2), removeHomeInfo);

module.exports = router;
