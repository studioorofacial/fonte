const app = require('./app');
require('./database/connection');
require('dotenv').config();

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});