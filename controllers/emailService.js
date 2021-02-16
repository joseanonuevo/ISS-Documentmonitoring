const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mailgun = require("mailgun-js");
const db = require("../db/connectDB");

const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: process.env.MAILGUN_DOMAIN,
});

exports.register = (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  db.query(
    "SELECT user_Email FROM users WHERE user_Email = ?",
    [email],
    async (error, results) => {
      if (results.length > 0) {
        return res.status(400).json({
          error: "user exists already",
        });
      } else {
        const token = jwt.sign(
          {
            email,
          },
          process.env.JWT_ACC_ACTIVATE,
          {
            expiresIn: "60m",
          }
        );
        /*
        res.cookie("emailtoken", token, {
          maxAge: 60000,
          httpOnly: true,
        });
        */
        console.log(token);
        const data = {
          from: "codesanonuevo@gmail.com",
          to: email,
          subject: "Account Activation link",
          html: `
          <!DOCTYPE html>
          <html lang="en">

          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Document</title>
              <style>
                  #resetpw-btn {
                      background-color: orange;
                      width: 150px;
                      height: 30px;
                      border: none;
                      border-radius: 50px;
                      color: white;
                  }

                  .email-container {
                      box-shadow: 0 0 8px #ccc;
                      padding: 30px;
                      margin-left: auto;
                      margin-right: auto;
                      width: 600px;
                      border: solid 1px black;
                  }

                  .email-header {
                      margin-left: auto;
                      margin-right: auto;
                  }

                  #iss-logo {
                      width: 50px;
                      height: 50px;
                      position: relative;
                      top: 12px;
                  }

                  #header-list {
                      list-style: none;
                      width: 100%;
                      height: 90px;
                      margin: 0;
                      padding: 0;
                      white-space: nowrap;
                      overflow-x: auto;
                      overflow-y: hidden;
                  }

                  #header-list>li {
                      display: inline-block;
                  }

                  .container {
                      background-color: white;
                      width: 680px;
                      margin-left: auto;
                      margin-right: auto;
                  }
              </style>
          </head>

          <body>
              <div class="container">
                  <div class="email-header">
                      <center>
                          <ul id="header-list">
                              <li><img src="https://scontent.fmnl2-1.fna.fbcdn.net/v/t31.0-8/13995619_1244444428913204_2794517576543849237_o.png?_nc_cat=100&ccb=2&_nc_sid=174925&_nc_ohc=e7JTAN5J6VsAX_ppGXe&_nc_ht=scontent.fmnl2-1.fna&oh=4cef3eaec49c01bf273941ea9b279e8a&oe=60031495"
                                      alt="iss-logo" id="iss-logo"></li>
                              <li>
                                  <h2>Information Systems Society</h2>
                              </li>
                          </ul>
                      </center>
                  </div>

                  <div class="email-container">
                      <section>
                          <h3>Good Day!</h3>
                      </section>


                      <section>
                          <p>To register to e-Monitor of ISS, click the registration button to
                              access the link
                              and
                              kindly place the
                              verification code in the form.
                          </p>
                      </section>

                      <br>

                      <center>
                          <a href="${process.env.CLIENT_URL}/activation"
                              id="reset-link"><button id="resetpw-btn">Register Here</button>
                          </a>

                      </center>

                      <br>

                      <section>
                          <p>VERIFICATION CODE: ${token}</p>
                      </section>

                      <section>
                          <p>Cheers, <br> Information Systems Society (UST-ISS)</p>
                      </section>
                  </div>
              </div>
          </body>

          </html>
        `,
        };
        mg.messages().send(data, (error, body) => {
          console.log(body);
          if (error) return console.log(error);
          else
            return res.status(200).json({
              message: "Email sent please activate account",
            });
        });
      }
    }
  );
};

exports.activateAccount = (req, res, next) => {
  try {
    date = Date.now();
    const {
      fname,
      mi,
      lname,
      regdate,
      position,
      password,
      confirmpw,
      token,
    } = req.body;
    console.log(req.body);
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_ACC_ACTIVATE,
        async (err, decodedToken) => {
          if (err) {
            return res.send(400).json({
              error: "Incorrect or expired link",
            });
          }
          const { email } = decodedToken;
          const hashedPassword = await bcrypt.hash(password, 5);
          console.log(hashedPassword);
          db.query(
            "SELECT user_Email FROM users WHERE user_Email = ?",
            [email],
            (error, results) => {
              if (results.length > 0) {
                return res.status(400).json({
                  error: "Invalid request",
                });
              }
            }
          );
          db.query(
            "INSERT INTO users (user_lastName,user_firstName,user_middleInitial,user_commencementDate,user_Position, user_Email,user_Password,admin_ID) VALUES (?,?,?,?,?,?,?,?)",
            [lname, fname, mi, regdate, position, email, hashedPassword, 1],
            (error, results) => {
              if (error) {
                return res.status(400).json({
                  message: error,
                });
              } else {
                console.log(results);
                return res.status(200).json({
                  message: "Account Registered",
                });
              }
            }
          );
        }
      );
    }
  } catch {
    return res.stastus(400).json({
      message: error,
    });
  }
};

exports.requestPwChange = (req, res) => {
  console.log(req.body);
  const { email } = req.body;
  db.query(
    "SELECT * FROM users WHERE user_Email = ?",
    [email],
    async (error, results) => {
      if (results.length === 0) {
        return res.status(400).json({ error: "No Account" });
      } else {
        const token = jwt.sign(
          {
            email,
          },
          process.env.JWT_ACC_ACTIVATE,
          {
            expiresIn: "60m",
          }
        );
        const data = {
          from: "codesanonuevo@gmail.com",
          to: email,
          subject: "Reset Password",
          html: `<h2>Please proceed to link to reset password</h2>
                 <p>${process.env.CLIENT_URL}/activation</p>
                 <p>${token}</p>
          `,
        };
        mg.messages().send(data, (error, body) => {
          console.log(body);
          if (error) return console.log(error);
          else
            return res.status(200).json({
              message: "Email sent",
            });
        });
      }
    }
  );
};

exports.resetPw = (req, res) => {
  const { token, password } = req.body;
  console.log(req.body);
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_ACC_ACTIVATE,
      async (err, decodedToken) => {
        if (err) {
          return res.send(400).json({
            error: "Incorrect or expired link",
          });
        }
        const { email } = decodedToken;
        const hashedPassword = await bcrypt.hash(password, 5);
        console.log(hashedPassword);
        db.query(
          "UPDATE users SET user_Password = ? WHERE user_Email = ?",
          [hashedPassword, email],
          (error, results) => {
            if (error) {
              return res.stastus(400).json({
                message: error,
              });
            } else {
              console.log(results);
              return res.status(200).json({
                message: "Password Updated",
              });
            }
          }
        );
      }
    );
  }
};
