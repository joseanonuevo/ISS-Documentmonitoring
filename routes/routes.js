const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db/connectDB");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/home", verify, (req, res) => {
  const sql = "SELECT * from users";
  db.query(sql, (err, results) => {
    if (!err)
      return res.render("home", {
        names: JSON.stringify(results),
      });
    else return res.json(err);
  });
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
