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
  query =
    "SELECT createDocu_Title FROM create_document WHERE createDocu_ID = ?";
  db.query(query, [id], (err, results) => {
    const document_name = results[0].createDocu_Title;
    query2 =
      "INSERT INTO activity_log (activity,document_name,user_id) VALUES(?,?,?)";
    db.query(
      query2,
      ["has deleted", document_name, request.cookies.authcookie2],
      (err, results) => {
        console.log("pass");
      }
    );
  });
  const result = deleteRowById(id);
  result
    .then((data) =>
      response.json({
        success: true,
      })
    )
    .catch((err) => console.log(err));
});
app.delete("/deleteUpdate/:id", (request, response) => {
  const { id } = request.params;
  var create_docuID = request.headers.referer;
  var new_ID = create_docuID.split("/").pop();
  const sql =
    "SELECT MAX(updateDocu_ID) as query_ID FROM update_document WHERE createDocu_ID = ?";
  db.query(sql, [new_ID], (err, result) => {
    c1 = result[0].query_ID; //query results comparison
    c2 = id; //original
    if (c1 > c2) {
      console.log("delete lang");
      console.log(new_ID);
      const result = deleteRowByIdUpdate(id);
      result
        .then((data) =>
          response.json({
            success: true,
          })
        )
        .catch((err) => console.log(err));
    } else if (c1 == c2) {
      const query = "DELETE FROM update_document WHERE updateDocu_ID = ?";
      db.query(query, [id], (err, results) => {
        console.log("passed");
      });
      const result = deleteRowById(new_ID);
      result
        .then((data) =>
          response.json({
            success: true,
          })
        )
        .catch((err) => console.log(err));
    } else {
      const sql1 =
        "SELECT * FROM update_document WHERE updateDocu_ID = ? AND createDocu_ID = ?";
      db.query(sql1, [c1 - 1, new_ID], (err, result) => {
        sql2 =
          "UPDATE create_document SET createDocu_Title = ?, createDocu_Date = ?, createDocu_Notes = ?, createDocu_tobeSignedby = ?, createDocu_Attachment = ?, createDocu_Status = ?, user_ID = ? WHERE createDocu_ID = ?";
        db.query(
          sql2,
          [
            result[0].updateDocu_Title,
            result[0].updadteDocu_Date,
            result[0].updateDocu_Notes,
            result[0].updateDocu_Signedby,
            result[0].updateDocu_Attachment,
            result[0].updateDocu_Status,
            result[0].updateUser_ID,
            new_ID,
          ],
          (err, results) => {
            const result = deleteRowByIdUpdate(id);
            result
              .then((data) =>
                response.json({
                  success: true,
                })
              )
              .catch((err) => console.log(err));
          }
        );
      });
    }
  });
});
app.patch("/archive/:id", (request, response) => {
  const { id } = request.params;
  query =
    "SELECT createDocu_Title FROM create_document WHERE createDocu_ID = ?";
  db.query(query, [id], (err, results) => {
    const document_name = results[0].createDocu_Title;
    query2 =
      "INSERT INTO activity_log (activity,document_name,user_id) VALUES(?,?,?)";
    db.query(
      query2,
      ["has archived", document_name, request.cookies.authcookie2],
      (err, results) => {
        console.log("pass");
      }
    );
  });
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
app.patch("/enable/:email", (request, response) => {
  const { email } = request.params;
  const result = enableRowById(email);
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
async function deleteRowByIdUpdate(id) {
  try {
    id = parseInt(id, 10);
    const response = await new Promise((resolve, reject) => {
      const query = "DELETE FROM update_document WHERE updateDocu_ID = ?";
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
async function enableRowById(email) {
  try {
    const response = await new Promise((resolve, reject) => {
      const query = "UPDATE users SET user_Status = 0 WHERE user_Email = ?";
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
