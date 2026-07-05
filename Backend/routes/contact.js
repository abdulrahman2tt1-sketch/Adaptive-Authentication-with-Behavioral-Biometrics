const express = require('express');
const router = express.Router();
const contactCtrl = require('../controllers/contactController');

router.post('/', contactCtrl.createMessage);
router.get('/', contactCtrl.getMessages);

module.exports = router;
