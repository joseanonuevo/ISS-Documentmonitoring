const express = require("express");
const router = express();

const { deleterow } = require("../controllers/functions");

router.delete("/delete", deleterow);

module.exports = router;
