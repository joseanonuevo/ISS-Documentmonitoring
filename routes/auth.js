const express = require("express");
const router = express.Router();
const limitter = require("express-rate-limit");

const loginLimitter = limitter({
  windowMs: 60000 * 60,
  max: 10,
  message: "Too many requests, please try again later.",
  handler: function (req, res) {
    return res.status(400).render("login", {
      timeout: "Too many requests, please try again later.",
    });
  },
});

const { login } = require("../controllers/auth");

router.post("/login", loginLimitter, login);

module.exports = router;
