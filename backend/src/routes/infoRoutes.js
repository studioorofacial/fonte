const express = require('express');
const router = express.Router();
const {
    listInfo,
    showInfo,
    storeInfo,
    editInfo,
    removeInfo
} = require('../controllers/infoControllers');

router.get('/info', listInfo);
router.get('/info/:id', showInfo);
router.post('/info', storeInfo);
router.put('/info/:id', editInfo);
router.delete('/info/:id', removeInfo);

module.exports = router;