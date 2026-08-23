const express = require('express');
const router = express.Router();
const {
    listLocation,
    showLocation,
    storeLocation,
    editLocation,
    removeLocation
} = require('../controllers/locationControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

router.get('/location', listLocation);
router.get('/location/:id', showLocation);
router.post('/location', authenticate, authorize(1, 2), storeLocation);
router.put('/location/:id', authenticate, authorize(1, 2), editLocation);
router.delete('/location/:id', authenticate, authorize(1, 2), removeLocation);

module.exports = router;
