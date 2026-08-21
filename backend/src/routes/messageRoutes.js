const express = require('express');
const router = express.Router();
const {
    listMessage,
    showMessage,
    storeMessage,
    editMessage,
    removeMessage
} = require('../controllers/messageControllers');

router.get('/message', listMessage);
router.get('/message/:id', showMessage);
router.post('/message', storeMessage);
router.put('/message/:id', editMessage);
router.delete('/message/:id', removeMessage);

module.exports = router;