const app = require('./app');
require('./src/database/connection.js');
require('dotenv').config();

console.log('EMAIL:', process.env.EMAIL_USER);

console.log('PASS:', process.env.EMAIL_PASS);

const PORT = process.env.PORT_SERVER || process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

