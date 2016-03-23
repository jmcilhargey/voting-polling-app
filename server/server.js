"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var Polls = require("./polls.js");

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client"));

mongoose.connect("mongodb://localhost:27017/polls");

app.route("/api/polls")
    .get(function(req, res) {
        Polls.find({ }, function(err, results) {
            if (err) { throw err; }
            res.json(results);
        })
    });
    
app.route("/api/new")    
    .post(function(req, res) {
        console.log(req.body);
        var newPoll = new Polls({
           title: req.body.title,
           options: req.body.options,
           date: new Date
        });
        
        newPoll.save(function(err, product) {
            if (err) { throw err; }
            res.json(product);
        });
        
    });

app.route("/api/vote")
    .put(function(req,res) {
        console.log(req.body.poll);
        console.log(req.body.vote);
        Polls.update({ _id : req.body.poll, "options.id": req.body.vote }, { $inc : { "options.$.votes" : 1 } }, function(err, results) {
            if (err) { throw err; }
            res.json(results);
        });
    });
    
app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});