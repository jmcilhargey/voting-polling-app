"use strict";

var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passport = require("passport");
var session = require("express-session");
var Users = require("./users.js");
var Polls = require("./polls.js");

require("dotenv").load();
require("./passport.js")(passport);
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + "/../client"));

app.use(session({
    secret: "votingApp",
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI);

// req.user.voted.indexOf(req.body.poll) === -1

function isLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("Not logged in");
        return next();
    } else {
        console.log("Not logged in");
        res.redirect("/login");
    }
}

app.route("/api/polls")
    .get(function(req, res) {
        Polls.find({ }, function(err, results) {
            if (err) { throw err; }
            res.json(results);
        })
    });
    
app.route("/api/poll/:id")
    .get(function(req, res) {
        Polls.find({ _id : req.params.id }, function(err, result) {
            if (err) { throw err; }
            res.json(result);            
        });
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
    .put(isLoggedIn, function(req,res) {
        Polls.update({ _id : req.body.poll, "options.id": req.body.vote }, { $inc : { "options.$.votes" : 1 } }, function(err, results) {
            if (err) { throw err; }
            
            Users.findOneAndUpdate({ "github.id": req.user.github.id }, { $push: { "voted": req.body.poll } }, function(err, result) {
                if (err) { throw err; }
            
                res.json(req.user);
            });
        });
    });
    
app.route("/api/user")
    .get(isLoggedIn, function(req, res) {
        res.json(req.user.github); 
    });    
    
app.route("/auth/github")
    .get(passport.authenticate("github"));
    
app.route("/auth/github/callback")
    .get(passport.authenticate("github", {
        successRedirect: "/vote",
        failureRedirect: "/login"
    }));
    
app.route("/logout")
    .get(function(req, res) {
       req.logout();
       res.redirect("/login");
    });
    
app.listen(process.env.PORT, function() {
  console.log("Listening on port " + process.env.PORT);
});