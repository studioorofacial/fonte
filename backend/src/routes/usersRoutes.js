const express = require('express');
const router = express.Router();
const {
    listUsers,
    showUser,
    storeUser,
    editUser,
    changePassword,
    removeUser
} = require('../controllers/usersControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');
const { validateNewUser } = require('../middlewares/validateUser');

// Todas as rotas de usuários exigem estar autenticado.
// Criar novo administrador: só Root (1) — é a regra de negócio pedida.
// Editar, trocar senha e excluir: Root (1) e Admin (2).
// Secretária (3) só visualiza (GET), nunca escreve.
router.get('/users', authenticate, listUsers);
router.get('/users/:id', authenticate, showUser);
router.post('/users', authenticate, authorize(1), validateNewUser, storeUser);
router.put('/users/:id', authenticate, authorize(1, 2), editUser);
router.put('/users/:id/senha', authenticate, authorize(1, 2), changePassword);
router.delete('/users/:id', authenticate, authorize(1, 2), removeUser);

module.exports = router;
