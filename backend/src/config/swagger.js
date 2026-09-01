const path = require('path');
const YAML = require('yamljs');

// Carrega a especificação OpenAPI a partir do arquivo docs/openapi.yaml.
// Manter a spec em YAML separada do código deixa a documentação mais fácil
// de revisar e versionar, sem poluir as rotas com comentários JSDoc.
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));

module.exports = swaggerDocument;
