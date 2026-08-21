const express = require('express');
const router = express.Router();
const {
    listTeam,
    showTeam,
    storeTeam,
    editTeam,
    removeTeam
} = require('../controllers/teamControllers');

router.get('/team', listTeam);
router.get('/team/:id', showTeam);
router.post('/team', storeTeam);
router.put('/team/:id', editTeam);
router.delete('/team/:id', removeTeam);

module.exports = router;