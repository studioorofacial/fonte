const express = require('express');
const router = express.Router();
const {
    listRoles,
    showRole,
    storeRole,
    editRole,
    removeRole
} = require('../controllers/rolesControllers');

router.get('/roles', listRoles);
router.get('/roles/:id', showRole);
router.post('/roles', storeRole);
router.put('/roles/:id', editRole);
router.delete('/roles/:id', removeRole);

module.exports = router;