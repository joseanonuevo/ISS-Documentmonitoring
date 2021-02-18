const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(cookieParser());

const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

//import routes
const emailService = require("./routes/emailService");
const auth = require("./routes/auth");
const routes = require("./routes/routes");
const upload = require("./routes/upload");
const functions = require("./routes/functions");

//thing used to parse
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//middleware
app.use("/auth", auth);
app.use("/api", emailService);
app.use("/", routes);
app.use("/upload", upload);
app.use("/functions", functions);

//FUNCTIONS
const db = require("./db/connectDB");

app.delete("/delete/:id", (request, response) => {
  const { id } = request.params;
  const result = deleteRowById(id);
  result
    .then((data) =>
      response.json({
        success: true,
      })
    )
    .catch((err) => console.log(err));
});
app.patch("/archive/:id", (request, response) => {
  const { id } = request.params;
  const result = archiveRowById(id);
  result
    .then((data) =>
      response.json({
        success: true,
      })
    )
    .catch((err) => console.log(err));
});
app.patch("/disable/:email", (request, response) => {
  const { email } = request.params;
  const result = disableRowById(email);
  result.then((data) => {
    response.json({
      success: true,
    });
  });
});

async function deleteRowById(id) {
  try {
    id = parseInt(id, 10);
    const response = await new Promise((resolve, reject) => {
      const query = "DELETE FROM create_document WHERE createDocu_ID = ?";

      db.query(query, [id], (err, results) => {
        if (err) reject(new Error(err.message));
        resolve(results);
      });
    });
    return response === 1 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function archiveRowById(id) {
  const dateArchived = new Date();
  try {
    id = parseInt(id, 10);
    const response = await new Promise((resolve, reject) => {
      const query =
        "UPDATE create_document SET status = 0 WHERE createDocu_ID = ?";
      db.query(query, [id], (err, results) => {
        if (err) reject(new Error(err.message));
        resolve(results);
      });
      const query2 =
        "INSERT INTO archive_document (archiveDocu_Date, createDocu_ID) VALUES(?,?)";
      db.query(query2, [dateArchived, id], (err, results) => {
        if (err) reject(new Error(err.message));
        resolve(results);
      });
    });
    return response === 1 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function disableRowById(email) {
  try {
    const response = await new Promise((resolve, reject) => {
      const query = "UPDATE users SET user_Status = 1 WHERE user_Email = ?";
      db.query(query, [email], (err, results) => {
        if (err) reject(new Error(err.message));
        resolve(results);
      });
    });
    return response === 1 ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server @ " + PORT);
});
