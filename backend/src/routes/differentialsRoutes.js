const express = require('express');
const router = express.Router();
const {
    listDifferentials,
    showDifferential,
    storeDifferential,
    editDifferential,
    removeDifferential
} = require('../controllers/differentialsControllers.js');
const { authenticate } = require('../middlewares/authLoginMiddleware');

router.get('/differentials', listDifferentials);
router.get('/differentials/:id', showDifferential);
router.post('/differentials', authenticate, storeDifferential);
router.put('/differentials/:id', authenticate, editDifferential);
router.delete('/differentials/:id', authenticate, removeDifferential);

module.exports = router;
