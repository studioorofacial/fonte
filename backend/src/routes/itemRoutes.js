const express = require('express');
const router = express.Router();
const {
    listItem,
    showItem,
    storeItem,
    editItem,
    removeItem
} = require('../controllers/itemControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

// Leitura é pública (o site público usa isso pra mostrar o catálogo)
router.get('/item', listItem);
router.get('/item/:id', showItem);

// Escrita exige estar logado no painel admin
router.post('/item', authenticate, authorize(1, 2), storeItem);
router.put('/item/:id', authenticate, authorize(1, 2), editItem);
router.delete('/item/:id', authenticate, authorize(1, 2), removeItem);

module.exports = router;