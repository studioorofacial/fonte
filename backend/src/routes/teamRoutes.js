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

router.get('/team', listTeam);
router.get('/team/:id', showTeam);
router.post('/team', authenticate, authorize(1, 2), storeTeam);
router.put('/team/:id', authenticate, authorize(1, 2), editTeam);
router.delete('/team/:id', authenticate, authorize(1, 2), removeTeam);

module.exports = router;
