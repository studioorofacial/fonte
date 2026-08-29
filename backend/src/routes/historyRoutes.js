const express = require('express');
const router = express.Router();
const {
    listHistory,
    showHistory,
    storeHistory,
    editHistory,
    removeHistory
} = require('../controllers/historyControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');
const { middlewareUpload } = require('../utils/uploadHelper');

// ============================================================
// UPLOAD DE IMAGEM DA HISTÓRIA
// ============================================================
router.post(
    '/upload-history',
    authenticate,
    authorize(1, 2),
    middlewareUpload('imagem'),
    (req, res) => {
        res.json({ path: req.imagemPath });
    }
);

router.get('/history', listHistory);
router.get('/history/:id', showHistory);
router.post('/history', authenticate, authorize(1, 2), storeHistory);
router.put('/history/:id', authenticate, authorize(1, 2), editHistory);
router.delete('/history/:id', authenticate, authorize(1, 2), removeHistory);

module.exports = router;
