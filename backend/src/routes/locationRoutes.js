const express = require('express');
const router = express.Router();
const {
    listLocation,
    showLocation,
    storeLocation,
    editLocation,
    removeLocation
} = require('../controllers/locationControllers');

router.get('/location', listLocation);
router.get('/location/:id', showLocation);
router.post('/location', storeLocation);
router.put('/location/:id', editLocation);
router.delete('/location/:id', removeLocation);

module.exports = router;
