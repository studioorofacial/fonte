// Valida o corpo da requisição de login
function validateLogin(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    next();
}

// Valida o corpo da requisição de criação de usuário
function validateNewUser(req, res, next) {
    const { name, email, login, password, phone, role_id } = req.body;

    if (!name || !email || !login || !password || !phone || !role_id) {
        return res.status(400).json({
            error: 'Campos obrigatórios: name, email, login, password, phone, role_id.'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Email inválido.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    next();
}

module.exports = { validateLogin, validateNewUser };
