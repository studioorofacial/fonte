const express = require('express');
const router = express.Router();
const {
    listTeam,
    showTeam,
    storeTeam,
    editTeam,
    removeTeam
} = require('../controllers/teamControllers');
const { authenticate } = require('../middlewares/authLoginMiddleware');

router.get('/team', listTeam);
router.get('/team/:id', showTeam);
router.post('/team', authenticate, storeTeam);
router.put('/team/:id', authenticate, editTeam);
router.delete('/team/:id', authenticate, removeTeam);

module.exports = router;
