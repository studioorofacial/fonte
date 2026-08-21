const express = require('express');
const router = express.Router();
const {
    listItem,
    showItem,
    storeItem,
    editItem,
    removeItem
} = require('../controllers/itemControllers');

router.get('/item', listItem);
router.get('/item/:id', showItem);
router.post('/item', storeItem);
router.put('/item/:id', editItem);
router.delete('/item/:id', removeItem);

module.exports = router;