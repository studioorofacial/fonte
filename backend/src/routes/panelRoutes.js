const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middlewares/authLoginMiddleware');

// Entrega o HTML de verdade do painel administrativo — só pra quem
// já está autenticado. O arquivo fica em backend/src/views/, uma
// pasta que o Live Server (ou qualquer servidor estático) NUNCA
// acessa, porque só serve a pasta frontend/. A única forma de obter
// esse conteúdo é chamando essa rota com um token válido.
router.get('/admin-panel', authenticate, (req, res) => {
    const caminho = path.join(__dirname, '../views/admin-panel.html');

    fs.readFile(caminho, 'utf-8', (err, html) => {
        if (err) {
            console.error('Erro ao ler admin-panel.html:', err.message);
            return res.status(500).json({ error: 'Erro ao carregar o painel.' });
        }
        res.type('html').send(html);
    });
});

module.exports = router;
