const express = require('express');
const router = express.Router();
const {
    listCarousel,
    showCarousel,
    storeCarousel,
    editCarousel,
    removeCarousel
} = require('../controllers/carouselControllers');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

router.get('/carousel', listCarousel);
router.get('/carousel/:id', showCarousel);
router.post('/carousel', authenticate, authorize(1, 2), storeCarousel);
router.put('/carousel/:id', authenticate, authorize(1, 2), editCarousel);
router.delete('/carousel/:id', authenticate, authorize(1, 2), removeCarousel);

module.exports = router;