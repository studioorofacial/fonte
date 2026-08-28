const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/img');
    },

    filename: (req, file, cb) => {
        const nome = Date.now() + '-' + file.originalname;
        cb(null, nome);
    }
});

const upload = multer({ storage });

router.post(
    '/upload-carousel',
    upload.single('imagem'),
    (req, res) => {

        res.json({
            path: `img/${req.file.filename}`
        });

    }
);

module.exports = router;