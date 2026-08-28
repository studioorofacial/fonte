
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const differentialsRoutes = require('./src/routes/differentialsRoutes');
const historyRoutes = require('./src/routes/historyRoutes');
const carouselRoutes = require('./src/routes/carouselRoutes.js');
const infoRoutes = require('./src/routes/infoRoutes.js');
const itemRoutes = require('./src/routes/itemRoutes.js');
const locationRoutes = require('./src/routes/locationRoutes.js');
const mainRoutes = require('./src/routes/mainRoutes.js');
const messageRoutes = require('./src/routes/messageRoutes.js');
const principlesRoutes = require('./src/routes/principlesRoutes.js');
const rolesRoutes = require('./src/routes/rolesRoutes.js');
const teamRoutes = require('./src/routes/teamRoutes.js');
const usersRoutes = require('./src/routes/usersRoutes.js');
const tokensRoutes = require('./src/routes/tokensRoutes.js');
const homeInfoRoutes = require('./src/routes/homeInfoRoutes.js');
const uploadRoutes = require('./src/routes/uploadRoutes.js');


// 1º: middlewares de configuração SEMPRE primeiro

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// 2º: rotas depois
app.use('/api', uploadRoutes);
app.use('/api', teamRoutes);
app.use('/api', rolesRoutes);
app.use('/api', principlesRoutes);
app.use('/api', messageRoutes);
app.use('/api', mainRoutes);
app.use('/api', locationRoutes);
app.use('/api', itemRoutes);
app.use('/api', infoRoutes);
app.use('/api', carouselRoutes);
app.use('/api', differentialsRoutes);
app.use('/api', historyRoutes);
app.use('/api', usersRoutes);
app.use('/api', tokensRoutes);
app.use('/api', homeInfoRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'API rodando com sucesso!' });
});

// Error handler global — impede que erros (ex: JSON malformado no corpo
// da requisição) derrubem o processo inteiro do Node. Deve ficar sempre
// por último, depois de todas as rotas.
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Corpo da requisição não é um JSON válido.' });
    }

    console.error('Erro não tratado:', err.stack || err.message);
    res.status(500).json({ error: 'Erro interno no servidor.' });
});

module.exports = app;