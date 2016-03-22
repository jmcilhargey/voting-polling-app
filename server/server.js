"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client"));

mongoose.connect("mongodb://localhost:27017/polls");

app.get("/", function(req, res) {
  
});

app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});