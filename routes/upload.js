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

const upload = multer({ storage }).single("key");
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
      [
        document_title,
        dateAdded,
        note,
        to_be_signed,
        data.Location,
        status,
        req.cookies.authcookie2,
      ],
      (err, result) => {
        const newId = result.insertId;
        const sql2 =
          "INSERT INTO update_document (updateDocu_Title,updateDocu_Date, updateDocu_Notes,updateDocu_Signedby,updateDocu_Attachment,updateDocu_Status,updateUser_ID,createDocu_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(
          sql2,
          [
            document_title,
            dateAdded,
            note,
            to_be_signed,
            data.Location,
            status,
            req.cookies.authcookie2,
            newId,
          ],
          (err, result) => {
            return console.log(err);
          }
        );
        const sql3 =
          "INSERT INTO activity_log(activity,user_id,document_name) VALUES(?,?,?)";
        db.query(
          sql3,
          ["has created", req.cookies.authcookie2, document_title],
          (err, result) => {
            console.log(
              `${req.cookies.authcookie2} uploaded a document ${document_title}`
            );
          }
        );
        res.status(200).redirect("/home");
      }
    );
  });
});

router.post("/update/", upload, (req, res) => {
  //url
  var create_docuID = req.headers.referer;
  var new_ID = create_docuID.split("/").pop();

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

    const sql =
      "INSERT INTO update_document (updateDocu_Title,updateDocu_Date, updateDocu_Notes,updateDocu_Signedby,updateDocu_Attachment,updateDocu_Status,updateUser_ID,createDocu_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        document_title,
        dateAdded,
        note,
        to_be_signed,
        data.Location,
        status,
        req.cookies.authcookie2,
        new_ID,
      ],
      (err, result) => {}
    );
    const sql2 =
      "UPDATE create_document SET createDocu_Title = ?, createDocu_Date = ?, createDocu_Notes = ?, createDocu_tobeSignedby = ?, createDocu_Attachment = ?,createDocu_Status = ?, user_ID = ? WHERE createDocu_ID = ?";
    db.query(
      sql2,
      [
        document_title,
        dateAdded,
        note,
        to_be_signed,
        data.Location,
        status,
        req.cookies.authcookie2,
        new_ID,
      ],
      (err, result) => {
        const sql3 =
          "INSERT INTO activity_log(activity,user_id,document_name) VALUES(?,?,?)";
        db.query(
          sql3,
          ["has updated", req.cookies.authcookie2, document_title],
          (err, result) => {
            console.log(
              `${req.cookies.authcookie2} updated document ${document_title}`
            );
          }
        );
      }
    );
    res.status(200).redirect("/update/" + new_ID);
  });
});

router.post("/uploadAdmin", upload, (req, res) => {
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
      [
        document_title,
        dateAdded,
        note,
        to_be_signed,
        data.Location,
        status,
        req.cookies.authcookie2,
      ],
      (err, result) => {
        const newId = result.insertId;
        const sql2 =
          "INSERT INTO update_document (updateDocu_Title,updateDocu_Date, updateDocu_Notes,updateDocu_Signedby,updateDocu_Attachment,updateDocu_Status,updateUser_ID,createDocu_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(
          sql2,
          [
            document_title,
            dateAdded,
            note,
            to_be_signed,
            data.Location,
            status,
            req.cookies.authcookie2,
            newId,
          ],
          (err, result) => {
            return console.log(err);
          }
        );
        res.status(200).redirect("/adminHome");
      }
    );
  });
});

router.post("/updateAdmin/", upload, (req, res) => {
  //url
  var create_docuID = req.headers.referer;
  var new_ID = create_docuID.split("/").pop();

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

    const sql =
      "INSERT INTO update_document (updateDocu_Title,updateDocu_Date, updateDocu_Notes,updateDocu_Signedby,updateDocu_Attachment,updateDocu_Status,updateUser_ID,createDocu_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        document_title,
        dateAdded,
        note,
        to_be_signed,
        data.Location,
        status,
        req.cookies.authcookie2,
        new_ID,
      ],
      (err, result) => {}
    );
    const sql2 =
      "UPDATE create_document SET createDocu_Title = ?, createDocu_Date = ?, createDocu_Notes = ?, createDocu_tobeSignedby = ?, createDocu_Attachment = ?,createDocu_Status = ?, user_ID = ? WHERE createDocu_ID = ?";
    db.query(
      sql2,
      [
        document_title,
        dateAdded,
        note,
        to_be_signed,
        data.Location,
        status,
        req.cookies.authcookie2,
        new_ID,
      ],
      (err, result) => {
        console.log("pass");
      }
    );
    res.status(200).redirect("/update/" + new_ID);
  });
});

module.exports = router;
