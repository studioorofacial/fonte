require('dotenv').config();

const app = require('./app');
const PORT = Number(process.env.PORT || 6000);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
