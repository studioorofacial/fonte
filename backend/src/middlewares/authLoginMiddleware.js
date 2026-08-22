const jwt = require('jsonwebtoken');

// Verifica se o access token enviado no header Authorization é válido.
// Formato esperado: Authorization: Bearer <token>
function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso não fornecido.' });
    }

    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = payload; // { id_user, role_id }
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
    }
}

// Restringe a rota a determinados cargos (role_id).
// roles: 1 = root, 2 = admin, 3 = secretaria (conforme tabela "roles")
// Ex: authorize(1, 2) -> só root e admin podem acessar a rota
function authorize(...allowedRoleIds) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado.' });
        }
        if (!allowedRoleIds.includes(req.user.role_id)) {
            return res.status(403).json({ error: 'Acesso negado para este cargo.' });
        }
        next();
    };
}

module.exports = { authenticate, authorize };
