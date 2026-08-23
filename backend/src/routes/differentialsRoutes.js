const express = require('express');
const router = express.Router();
const {
    listDifferentials,
    showDifferential,
    storeDifferential,
    editDifferential,
    removeDifferential
} = require('../controllers/differentialsControllers.js');
const { authenticate, authorize } = require('../middlewares/authLoginMiddleware');

router.get('/differentials', listDifferentials);
router.get('/differentials/:id', showDifferential);
router.post('/differentials', authenticate, authorize(1, 2), storeDifferential);
router.put('/differentials/:id', authenticate, authorize(1, 2), editDifferential);
router.delete('/differentials/:id', authenticate, authorize(1, 2), removeDifferential);

module.exports = router;
