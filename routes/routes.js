const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db/connectDB");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/home", verify, (req, res) => {
  const sql = "SELECT * from create_document WHERE status = 1";
  db.query(sql, (err, results) => {
    if (!err)
      return res.render("home", {
        names: results,
      });
    else return res.json(err);
  });
});

router.get("/adminHome", verify, (req, res) => {
  const sql = "SELECT * from create_document WHERE status = 1";
  db.query(sql, (err, results) => {
    if (!err)
      return res.render("adminHome", {
        names: results,
      });
    else return res.json(err);
  });
});

router.get("/archive", verify, (req, res) => {
  const sql = "SELECT * from create_document WHERE status = 0";
  db.query(sql, (err, results) => {
    if (!err)
      return res.render("archive", {
        names: results,
      });
    else return res.json(err);
  });
});

router.get("/adminArchive", verify, (req, res) => {
  const sql = "SELECT * from create_document WHERE status = 0";
  db.query(sql, (err, results) => {
    if (!err)
      return res.render("adminArchive", {
        names: results,
      });
    else return res.json(err);
  });
});

router.get("/update/:id", (req, res) => {
  const sql = "SELECT * from update_document WHERE createDocu_ID = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (!err) {
      res.render("docUpdates", {
        names: results,
      });
    } else return res.json(err);
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("authcookie");
  res.clearCookie("authcookie2");
  res.render("login");
});

router.get("/adminUpdate/:id", (req, res) => {
  const sql = "SELECT * from update_document WHERE createDocu_ID = ?";
  db.query(sql, [req.params.id], (err, results) => {
    if (!err)
      return res.render("adminDocUpdates", {
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
  const sql = "SELECT * FROM users where user_status =0";
  db.query(sql, (err, results) => {
    if (!err)
      res.render("registeredUsers", {
        names: results,
      });
    else return res.json(err);
  });
});

router.get("/disabledUsers", (req, res) => {
  const sql = "SELECT * FROM users where user_status =1";
  db.query(sql, (err, results) => {
    if (!err)
      res.render("disabledUsers", {
        names: results,
      });
    else return res.json(err);
  });
});
router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/adminHome", (req, res) => {
  res.render("adminHome");
});

router.get("/alertPage", (req, res) => {
  res.render("alertPage");
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
