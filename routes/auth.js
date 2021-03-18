const express = require("express");
const router = express.Router();
const limitter = require("express-rate-limit");

const loginLimitter = limitter({
  windowMs: 60000 * 60,
  max: 10,
  message: "Too attempts, please try again after an hour",
});

const { login } = require("../controllers/auth");

router.post("/login", login);

module.exports = router;
