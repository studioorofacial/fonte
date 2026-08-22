const express = require('express');
const router = express.Router();
const {
    listCarousel,
    showCarousel,
    storeCarousel,
    editCarousel,
    removeCarousel
} = require('../controllers/carouselControllers');
const { authenticate } = require('../middlewares/authLoginMiddleware');

router.get('/carousel', listCarousel);
router.get('/carousel/:id', showCarousel);
router.post('/carousel', authenticate, storeCarousel);
router.put('/carousel/:id', authenticate, editCarousel);
router.delete('/carousel/:id', authenticate, removeCarousel);

module.exports = router;