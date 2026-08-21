const express = require('express');
const router = express.Router();
const {
    listPrinciples,
    showPrinciple,
    storePrinciple,
    editPrinciple,
    removePrinciple
} = require('../controllers/principlesControllers');

router.get('/principles', listPrinciples);
router.get('/principles/:id', showPrinciple);
router.post('/principles', storePrinciple);
router.put('/principles/:id', editPrinciple);
router.delete('/principles/:id', removePrinciple);

module.exports = router;