const express = require('express');
const router = express.Router();
const {
    listMain,
    showMain,
    storeMain,
    editMain,
    removeMain
} = require('../controllers/mainControllers');
const { authenticate } = require('../middlewares/authLoginMiddleware');

// Leitura é pública (o site usa isso pra mostrar os banners de cada página)
router.get('/main', listMain);
router.get('/main/:id', showMain);

// Escrita exige estar logado no painel admin
router.post('/main', authenticate, storeMain);
router.put('/main/:id', authenticate, editMain);
router.delete('/main/:id', authenticate, removeMain);

module.exports = router;