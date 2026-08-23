const express = require('express');
const router = express.Router();
const {
    listMessage,
    showMessage,
    storeMessage,
    removeMessage
} = require('../controllers/messageControllers');
const { authenticate } = require('../middlewares/authLoginMiddleware');

// Mensagens são dados privados (nome/email/texto de quem preencheu o
// formulário) — só quem está logado no painel pode ver ou excluir.
router.get('/message', authenticate, listMessage);
router.get('/message/:id', authenticate, showMessage);

// Criar é público: é o próprio formulário de contato do site que usa isso
router.post('/message', storeMessage);

router.delete('/message/:id', authenticate, removeMessage);

module.exports = router;