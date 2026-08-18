const express = require('express');
const router = express.Router();
const {
    listHistory,
    showHistory,
    storeHistory,
    editHistory,
    removeHistory
} = require('../controllers/historyControllers');

router.get('/history', listHistory);
router.get('/history/:id', showHistory);
router.post('/history', storeHistory);
router.put('/history/:id', editHistory);
router.delete('/history/:id', removeHistory);

module.exports = router;