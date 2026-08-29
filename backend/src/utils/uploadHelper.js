const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Destino sempre frontend/img, relativo à raiz do projeto — 3 níveis
// acima de backend/src/utils
const DESTINO = path.join(__dirname, '../../../frontend/img');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DESTINO);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Apenas imagens são permitidas.'));
        }
        cb(null, true);
    }
});

// Middleware pronto pra usar em qualquer rota de upload de imagem.
// Depois de rodar, deixa o caminho relativo salvo em req.imagemPath.
function middlewareUpload(campoArquivo) {
    return (req, res, next) => {
        upload.single(campoArquivo)(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!req.file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
            }
            req.imagemPath = `img/${req.file.filename}`;
            next();
        });
    };
}

// Só considera "de upload" um caminho no formato "img/1699999999999-nome.jpg"
// (timestamp de 13 dígitos na frente — é assim que o multer nomeia acima).
// Evita apagar por engano uma imagem estática/compartilhada digitada
// manualmente no campo (ex: "img/1.jpg").
function ehImagemDeUpload(caminho) {
    return typeof caminho === 'string' && /^img\/\d{13}-.+/.test(caminho);
}

// Apaga o arquivo físico correspondente, só se ele veio de upload.
// Erros são só logados (nunca derrubam a resposta principal ao usuário).
function apagarArquivoDeUpload(caminhoRelativo) {
    if (!ehImagemDeUpload(caminhoRelativo)) return;

    const caminhoAbsoluto = path.join(__dirname, '../../../frontend', caminhoRelativo);

    fs.unlink(caminhoAbsoluto, (err) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Erro ao apagar arquivo de upload:', err.message);
        }
    });
}

module.exports = { middlewareUpload, ehImagemDeUpload, apagarArquivoDeUpload };
