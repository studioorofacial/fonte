const express = require('express');
const router = express.Router();
const {
    listMain,
    showMain,
    storeMain,
    editMain,
    removeMain
} = require('../controllers/mainControllers');

router.get('/main', listMain);
router.get('/main/:id', showMain);
router.post('/main', storeMain);
router.put('/main/:id', editMain);
router.delete('/main/:id', removeMain);

module.exports = router;