const express = require('express');
const app = express();
const differentialsRoutes = require('./src/routes/differentialsRoutes');
const historyRoutes = require('./src/routes/historyRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'API rodando com sucesso!' });
});

app.use('/api', differentialsRoutes);
app.use('/api', historyRoutes);

module.exports = app;