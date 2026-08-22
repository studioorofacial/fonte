const path = require('node:path');
const express = require('express');
const cors = require('cors');
const cmsRoutes = require('./src/routes/cmsRoutes');

// Rotas legadas do branch main-v2 continuam disponíveis para compatibilidade.
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

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// API CMS unificada usada pelo frontend atual.
app.use('/api', cmsRoutes);

// API legada, mantida para não quebrar consumidores existentes.
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

app.get('/', (req, res) => res.json({ message: 'API rodando com sucesso!' }));
app.use(express.static(path.resolve(__dirname, '../frontend')));

app.use((error, req, res, next) => {
  console.error('[API]', error);
  if (res.headersSent) return next(error);
  res.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Erro interno do servidor.',
  });
});

module.exports = app;
