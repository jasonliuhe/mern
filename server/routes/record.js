const express = require("express");
var uniqid = require("uniqid");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

//This will help us connect to the database
const dbo = require("../db/conn");

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("employees");
  db_connect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let myobj = {
    rid: uniqid(),
    person_name: req.body.person_name,
    person_position: req.body.person_position,
    person_level: req.body.person_level,
  };
  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;
  });
  res.json({ response: "OK" });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:rid").post(function (req, res) {
  let db_connect = dbo.getDb("employees");
  let myquery = { rid: req.params.rid };
  console.log(myquery);
  console.log(req.body.person_name);
  console.log(req.body.person_position);
  console.log(req.body.person_level);
  let newvalues = {
    $set: {
      person_name: req.body.person_name,
      person_position: req.body.person_position,
      person_level: req.body.person_level,
    },
  };
  console.log(newvalues);
  db_connect
    .collection("records")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) {
        console.log(err);
      }

      console.log("1 document updated");
    });
  res.json({ response: "OK" });
});

// This section will help you delete a record
recordRoutes.route("/:rid").delete((req, res) => {
  let db_connect = dbo.getDb("employees");
  var myquery = { rid: req.params.rid };
  console.log(myquery);
  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  });
  res.json({ response: "OK" });
});

module.exports = recordRoutes;
