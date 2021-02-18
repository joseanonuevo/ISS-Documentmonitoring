const express = require("express");
const router = express();

const { changePw } = require("../controllers/functions");

router.post("/changePw", changePw);
//
module.exports = router;
