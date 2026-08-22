const express = require('express');
const router = express.Router();
const {
    listHistory,
    showHistory,
    storeHistory,
    editHistory,
    removeHistory
} = require('../controllers/historyControllers');
const { authenticate } = require('../middlewares/authLoginMiddleware');

router.get('/history', listHistory);
router.get('/history/:id', showHistory);
router.post('/history', authenticate, storeHistory);
router.put('/history/:id', authenticate, editHistory);
router.delete('/history/:id', authenticate, removeHistory);

module.exports = router;
