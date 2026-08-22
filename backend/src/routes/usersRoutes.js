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
// Criar e editar cadastro: só root (1) e admin (2).
// Excluir usuário: só root (1).
router.get('/users', authenticate, listUsers);
router.get('/users/:id', authenticate, showUser);
router.post('/users', authenticate, authorize(1, 2), validateNewUser, storeUser);
router.put('/users/:id', authenticate, authorize(1, 2), editUser);
router.put('/users/:id/senha', authenticate, changePassword);
router.delete('/users/:id', authenticate, authorize(1), removeUser);

module.exports = router;
