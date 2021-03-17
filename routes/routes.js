const { compareSync } = require("bcrypt");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db/connectDB");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/home", verify, (req, res) => {
  const sql =
    "SELECT * from create_document WHERE status = 1 ORDER BY createDocu_ID DESC";
  db.query(sql, (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("home", {
          names: results1,
          activities: results2,
        });
      });
    } else {
      res.json(err);
    }
  });
});

router.get("/adminHome", verify, isAdmin, (req, res) => {
  const sql =
    "SELECT * from create_document WHERE status = 1 ORDER BY createDocu_ID DESC";
  db.query(sql, (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("adminHome", {
          names: results1,
          activities: results2,
        });
      });
    } else return res.json(err);
  });
});

router.get("/archive", verify, (req, res) => {
  const sql = "SELECT * from create_document WHERE status = 0";
  db.query(sql, (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("archive", {
          names: results1,
          activities: results2,
        });
      });
    } else return res.json(err);
  });
});

router.get("/adminArchive", verify, isAdmin, (req, res) => {
  const sql = "SELECT * from create_document WHERE status = 0";
  db.query(sql, (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("adminArchive", {
          names: results1,
          activities: results2,
        });
      });
    } else return res.json(err);
  });
});

router.get("/update/:id", verify, (req, res) => {
  const sql =
    "SELECT * from update_document WHERE createDocu_ID = ? ORDER BY updateDocu_ID DESC";
  db.query(sql, [req.params.id], (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("docUpdates", {
          names: results1,
          activities: results2,
        });
      });
    } else return res.json(err);
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("authcookie");
  res.clearCookie("authcookie2");
  res.render("login");
});

router.get("/adminUpdate/:id", verify, isAdmin, (req, res) => {
  const sql =
    "SELECT * from update_document WHERE createDocu_ID = ? ORDER BY updateDocu_ID DESC";
  db.query(sql, [req.params.id], (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("adminDocUpdates", {
          names: results1,
          activities: results2,
        });
      });
    } else return res.json(err);
  });
});

router.get("/resetPW/:id", (req, res) => {
  res.render("resetPW");
});

router.get("/registration/:id", (req, res) => {
  res.render("registration");
});

router.get("/registeredUsers", verify, isAdmin, (req, res) => {
  const sql = "SELECT * FROM users where user_status = 0";
  db.query(sql, (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("registeredUsers", {
          names: results1,
          activities: results2,
        });
      });
    } else return res.json(err);
  });
});

router.get("/disabledUsers", verify, isAdmin, (req, res) => {
  const sql = "SELECT * FROM users where user_status = 1";
  db.query(sql, (err, results1) => {
    if (!err) {
      const sql2 =
        "SELECT * FROM activity_log INNER JOIN users ON users.user_ID = activity_log.user_id ORDER BY date DESC";
      db.query(sql2, (err, results2) => {
        res.render("disabledUsers", {
          names: results1,
          activities: results2,
        });
      });
    } else return res.json(err);
  });
});
router.get("/register", verify, isAdmin, (req, res) => {
  res.render("register");
});

router.get("/alertPage", (req, res) => {
  res.render("alertPage");
});

router.get("/alertPage2", (req, res) => {
  res.render("alertPage2");
});

function verify(req, res, next) {
  const authcookie = req.cookies.authcookie;
  jwt.verify(authcookie, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(400).render("login", {
        message: "You must login to continue",
      });
    } else {
      next();
    }
  });
}

function isAdmin(req, res, next) {
  const id = req.cookies.authcookie2;
  const sql = "SELECT isAdmin FROM users WHERE user_ID = ?";
  db.query(sql, [id], (err, result) => {
    if (result[0].isAdmin === 1) {
      next();
    } else {
      return res.status(400).render("alertPage", {
        wrongOldPw: "Not an Admin!",
        error: "error",
      });
    }
  });
}

module.exports = router;
