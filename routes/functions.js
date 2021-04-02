const express = require('express');
const router = express();

const { changePw, editAccount } = require('../controllers/functions');

router.post('/changePw', changePw);

router.post('/editAccount', editAccount);

module.exports = router;
