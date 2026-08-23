const express = require('express');
const router = express.Router();
const {
    listInfo,
    showInfo,
    storeInfo,
    editInfo,
    removeInfo
} = require('../controllers/infoControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

router.get('/info', listInfo);
router.get('/info/:id', showInfo);
router.post('/info', authenticate, authorize(1, 2), storeInfo);
router.put('/info/:id', authenticate, authorize(1, 2), editInfo);
router.delete('/info/:id', authenticate, authorize(1, 2), removeInfo);

module.exports = router;