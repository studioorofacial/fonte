const express = require('express');
const router = express.Router();
const {
    listCarousel,
    showCarousel,
    storeCarousel,
    editCarousel,
    removeCarousel
} = require('../controllers/carouselControllers');

router.get('/carousel', listCarousel);
router.get('/carousel/:id', showCarousel);
router.post('/carousel', storeCarousel);
router.put('/carousel/:id', editCarousel);
router.delete('/carousel/:id', removeCarousel);

module.exports = router;