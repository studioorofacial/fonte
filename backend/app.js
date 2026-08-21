
const express = require('express');
const cors = require('cors');
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

// 1º: middlewares de configuração SEMPRE primeiro
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2º: rotas depois
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

app.get('/', (req, res) => {
    res.json({ message: 'API rodando com sucesso!' });
});

module.exports = app;