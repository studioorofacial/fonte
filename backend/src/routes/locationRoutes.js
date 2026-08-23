const express = require('express');
const router = express.Router();
const {
    listLocation,
    showLocation,
    storeLocation,
    editLocation,
    removeLocation
} = require('../controllers/locationControllers');
const { authenticate } = require('../middlewares/authLoginMiddleware');

router.get('/location', listLocation);
router.get('/location/:id', showLocation);
router.post('/location', authenticate, storeLocation);
router.put('/location/:id', authenticate, editLocation);
router.delete('/location/:id', authenticate, removeLocation);

module.exports = router;
