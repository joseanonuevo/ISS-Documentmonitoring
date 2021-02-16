const db = require("../db/connectDB");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).render("login", {
        message: "Provide credentials",
      });
    }
    db.query(
      "SELECT * FROM users WHERE user_Email = ?",
      [email],
      async (error, results) => {
        if (results.length === 0) {
          return res.status(400).render("login", {
            message: "Account does not exist in the system",
          });
        } else if (
          !results ||
          !(await bcrypt.compare(password, results[0].user_Password))
        ) {
          return res.status(400).render("login", {
            message: "Wrong Password",
          });
        } else {
          const id = results[0].user_ID;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          console.log("TOKEN:" + token);
          console.log("USER ID:" + id);
          res.cookie("authcookie", token, {
            maxAge: 86400000 * 2,
            httpOnly: true,
          });
          res.cookie("authcookie2", id, {
            maxAge: 86400000 * 2,
            httpOnly: true,
          });
          res.status(200).redirect("/home");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
};
