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

// Rota é /api/home-info (diferente de /api/info, que já é usada
// pela tabela contact_info)
router.get('/home-info', listHomeInfo);
router.get('/home-info/:id', showHomeInfo);
router.post('/home-info', authenticate, authorize(1, 2), storeHomeInfo);
router.put('/home-info/:id', authenticate, authorize(1, 2), editHomeInfo);
router.delete('/home-info/:id', authenticate, authorize(1, 2), removeHomeInfo);

module.exports = router;
