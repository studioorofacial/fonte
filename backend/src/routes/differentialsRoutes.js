const express = require('express');
const router = express.Router();
const {
  listDifferentials,
  showDifferential,
  storeDifferential,
  editDifferential,
  removeDifferential
} = require('../controllers/differentialsController');

router.get('/differentials', listDifferentials);
router.get('/differentials/:id', showDifferential);
router.post('/differentials', storeDifferential);
router.put('/differentials/:id', editDifferential);
router.delete('/differentials/:id', removeDifferential);

module.exports = router;