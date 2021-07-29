const express = require("express");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const url = "mongodb://localhost:27017/database";

// Create a storage object with a given configuration
const storage = new GridFsStorage({ url });

const dbo = require("../db/connfs");

// Set multer storage engine to the newly created object
const upload = multer({ storage });

const uploadRouter = express.Router();

uploadRouter
  .route("/file/upload")
  .post(upload.single("pdf"), (req, res, next) => {
    console.log(req.file);
    res.json({ response: "OK" });
  });

// This section will help you see file list
uploadRouter.route("/file/list").get(function (req, res) {
  let db_connect = dbo.getDb("database");
  db_connect
    .collection("fs.files")
    .find()
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json(result);
    });
});

module.exports = uploadRouter;
