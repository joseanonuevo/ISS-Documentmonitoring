const db = require("../db/connectDB");
const bcrypt = require("bcrypt");

exports.changePw = (req, res) => {
  try {
    const { oldpassword, newpassword, newpassword1 } = req.body;
    console.log(req.body);
    const id = req.cookies.authcookie2;

    if (newpassword !== newpassword1) {
      throw error;
    }
    sql1 = "SELECT user_Password FROM users WHERE user_ID = ?";
    db.query(sql1, [id], async (err, results) => {
      oldpw = results[0].user_Password;
      if (
        (await bcrypt.compare(oldpassword, results[0].user_Password)) === false
      ) {
        res.send("Wrong password");
      } else {
        // "UPDATE users SET user_Password = ? WHERE user_Email = ?"
        const hashedPassword = await bcrypt.hash(newpassword, 5);
        newsql = "UPDATE users SET user_Password = ? WHERE user_ID = ?";
        db.query(newsql, [hashedPassword, id], (err, results) => {
          if (!err) {
            res.send("Updated");
          } else {
            res.send(err);
          }
        });
      }
    });
  } catch {
    return res.send("Passwords do not match");
  }
};
