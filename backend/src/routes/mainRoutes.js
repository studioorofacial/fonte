const express = require('express');
const router = express.Router();
const {
    listMain,
    showMain,
    storeMain,
    editMain,
    removeMain
} = require('../controllers/mainControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

// Leitura é pública (o site usa isso pra mostrar os banners de cada página)
router.get('/main', listMain);
router.get('/main/:id', showMain);

// Escrita exige estar logado no painel admin
router.post('/main', authenticate, authorize(1, 2), storeMain);
router.put('/main/:id', authenticate, authorize(1, 2), editMain);
router.delete('/main/:id', authenticate, authorize(1, 2), removeMain);

module.exports = router;