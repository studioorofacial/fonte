const express = require('express');
const router = express.Router();
const {
    listTeam,
    showTeam,
    storeTeam,
    editTeam,
    removeTeam
} = require('../controllers/teamControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');
const { middlewareUpload } = require('../utils/uploadHelper');

// ============================================================
// UPLOAD DE FOTO DO MEMBRO DA EQUIPE
// ============================================================
router.post(
    '/upload-team',
    authenticate,
    authorize(1, 2),
    middlewareUpload('imagem'),
    (req, res) => {
        res.json({ path: req.imagemPath });
    }
);

router.get('/team', listTeam);
router.get('/team/:id', showTeam);
router.post('/team', authenticate, authorize(1, 2), storeTeam);
router.put('/team/:id', authenticate, authorize(1, 2), editTeam);
router.delete('/team/:id', authenticate, authorize(1, 2), removeTeam);

module.exports = router;
