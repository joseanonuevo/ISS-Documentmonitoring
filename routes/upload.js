const express = require("express");
const router = express();
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/connectDB");
uuidv4();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});

const storage = multer.memoryStorage({
  destination: function (req, file, callback) {
    callback(null, "");
  },
});

const upload = multer({ storage }).single("image");

router.post("/upload", upload, (req, res) => {
  let myFile = req.file.originalname.split(".");
  const fileType = myFile[myFile.length - 1];

  //for db
  const dateAdded = new Date();
  const user = req.cookies.authcookie2;
  const { document_title, note, to_be_signed, status } = req.body;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }
    console.log(data.Location);
    const sql =
      "INSERT INTO create_document (createDocu_Title,createDocu_Date, createDocu_Notes,createDocu_tobeSignedby,createDocu_Attachment,createDocu_Status,user_ID) VALUES (?, ?, ?, ?, ?, ?, ?);";
    db.query(
      sql,
      [document_title, dateAdded, note, to_be_signed, data.Location, status, 1],
      (err, result) => {
        return console.log(err);
      }
    );
    res.status(200).send(data);
  });
});
module.exports = router;
