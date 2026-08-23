const express = require('express');
const router = express.Router();
const {
    listPrinciples,
    showPrinciple,
    storePrinciple,
    editPrinciple,
    removePrinciple
} = require('../controllers/principlesControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

router.get('/principles', listPrinciples);
router.get('/principles/:id', showPrinciple);
router.post('/principles', authenticate, authorize(1, 2), storePrinciple);
router.put('/principles/:id', authenticate, authorize(1, 2), editPrinciple);
router.delete('/principles/:id', authenticate, authorize(1, 2), removePrinciple);

module.exports = router;
