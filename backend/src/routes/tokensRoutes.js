const express = require('express');
const router = express.Router();
const { login, refresh, logout } = require('../controllers/tokensControllers');
const { validateLogin } = require('../middlewares/validateUser');

router.post('/auth/login', validateLogin, login);
router.post('/auth/refresh', refresh);
router.post('/auth/logout', logout);

module.exports = router;
