const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmailOrLogin, getUserById } = require('../models/usersModel');
const { createToken, getByTokenValue, deleteToken } = require('../models/tokensModel');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateTokens');

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

// POST /api/auth/login
async function login(req, res) {
    try {
        // O front manda esse campo como "email", mas aceita tanto o
        // e-mail quanto o login (usuário) digitado na tela
        const { email: identificador, password } = req.body;

        const user = await getUserByEmailOrLogin(identificador);

        // Mensagem genérica: não revela se o problema foi o email ou a senha
        if (!user || user.status !== 1) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const senhaCorreta = await bcrypt.compare(password, user.password);
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        const expiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE);
        await createToken(refreshToken, expiresAt, user.id_user);

        res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            signed: true,
            maxAge: REFRESH_COOKIE_MAX_AGE
        });

        res.status(200).json({
            accessToken,
            user: {
                id_user: user.id_user,
                name: user.name,
                email: user.email,
                role_id: user.role_id
            }
        });
    } catch (error) {
        console.error('Erro no login:', error.message);
        res.status(500).json({ error: 'Erro interno ao fazer login.' });
    }
}

// POST /api/auth/refresh — gera um novo access token a partir do cookie de refresh
async function refresh(req, res) {
    try {
        const token = req.signedCookies[REFRESH_COOKIE_NAME];

        if (!token) {
            return res.status(401).json({ error: 'Refresh token não encontrado.' });
        }

        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const tokenRow = await getByTokenValue(token);
        if (!tokenRow || tokenRow.id_user !== payload.id_user) {
            return res.status(403).json({ error: 'Refresh token inválido.' });
        }

        if (new Date(tokenRow.expires_at) < new Date()) {
            await deleteToken(tokenRow.id_token);
            return res.status(403).json({ error: 'Refresh token expirado.' });
        }

        const user = await getUserById(payload.id_user);
        if (!user || user.status !== 1) {
            return res.status(403).json({ error: 'Usuário inválido.' });
        }

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error('Erro ao renovar token:', error.message);
        res.status(403).json({ error: 'Refresh token inválido ou expirado.' });
    }
}

// POST /api/auth/logout
async function logout(req, res) {
    try {
        const token = req.signedCookies[REFRESH_COOKIE_NAME];

        if (token) {
            const tokenRow = await getByTokenValue(token);
            if (tokenRow) {
                await deleteToken(tokenRow.id_token);
            }
        }

        res.clearCookie(REFRESH_COOKIE_NAME);
        res.status(200).json({ message: 'Logout realizado com sucesso.' });
    } catch (error) {
        console.error('Erro no logout:', error.message);
        res.status(500).json({ error: 'Erro ao fazer logout.' });
    }
}

module.exports = { login, refresh, logout };
