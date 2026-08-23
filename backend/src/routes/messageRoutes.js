const express = require('express');
const router = express.Router();
const {
    listMessage,
    showMessage,
    storeMessage,
    removeMessage
} = require('../controllers/messageControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

// Mensagens são dados privados (nome/email/texto de quem preencheu o
// formulário) — qualquer usuário logado pode ver (inclusive Secretária),
// mas só Root e Admin podem excluir.
router.get('/message', authenticate, listMessage);
router.get('/message/:id', authenticate, showMessage);

// Criar é público: é o próprio formulário de contato do site que usa isso
router.post('/message', storeMessage);

router.delete('/message/:id', authenticate, authorize(1, 2), removeMessage);

module.exports = router;