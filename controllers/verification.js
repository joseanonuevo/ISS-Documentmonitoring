const jwt = require("jsonwebtoken");

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

module.exports = verify;
