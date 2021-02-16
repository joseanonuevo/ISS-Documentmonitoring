const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db/connectDB");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/home", verify, (req, res) => {
  const sql = "SELECT * from create_document";
  db.query(sql, (err, results) => {
    if (!err)
      return res.render("home", {
        names: results,
      });
    else return res.json(err);
  });
});

router.get("/resetPW", (req, res) => {
  res.render("resetPW");
});

router.get("/registration", (req, res) => {
  res.render("registration");
});

router.get("/registeredUsers", (req, res) => {
  res.render("registeredUsers");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/adminHome", (req, res) => {
  res.render("adminHome");
});

function verify(req, res, next) {
  const authcookie = req.cookies.authcookie;
  jwt.verify(authcookie, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.send("ERROR");
    } else {
      next();
    }
  });
}

module.exports = router;
