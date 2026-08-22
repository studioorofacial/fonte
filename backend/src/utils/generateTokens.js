const jwt = require('jsonwebtoken');

// Access token: curta duração, usado no header Authorization de cada requisição
function generateAccessToken(user) {
    return jwt.sign(
        { id_user: user.id_user, role_id: user.role_id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
}

// Refresh token: longa duração, guardado em cookie httpOnly + tabela tokens
function generateRefreshToken(user) {
    return jwt.sign(
        { id_user: user.id_user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
}

module.exports = { generateAccessToken, generateRefreshToken };
