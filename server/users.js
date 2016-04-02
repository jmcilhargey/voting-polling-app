"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var User = mongoose.Schema({
    github: {
        id: String,
        displayName: String,
        username: String,
        publicRepos: Number
    },
    voted: [String]
}, { versionKey: false });

module.exports = mongoose.model("User", User);