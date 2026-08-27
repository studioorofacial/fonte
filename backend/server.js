const app = require('./app');
require('./src/database/connection.js');
require('dotenv').config();

const PORT = process.env.PORT_SERVER || process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});