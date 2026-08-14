require('dotenv').config();
require('./database/conection.js');

const express = require('express');

const app = express();
console.log('app.js carregado')

app.use(express.json());

app.get('/teste', (req, res) => {
    res.json({
        mensagem: 'API funcionando'
    });
});

module.exports = app;