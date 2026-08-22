const express = require('express');
const router = express.Router();
const {
    listPrinciples,
    showPrinciple,
    storePrinciple,
    editPrinciple,
    removePrinciple
} = require('../controllers/principlesControllers');
const { authenticate } = require('../middlewares/authLoginMiddleware');

router.get('/principles', listPrinciples);
router.get('/principles/:id', showPrinciple);
router.post('/principles', authenticate, storePrinciple);
router.put('/principles/:id', authenticate, editPrinciple);
router.delete('/principles/:id', authenticate, removePrinciple);

module.exports = router;
