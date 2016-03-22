"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Poll = new Schema({
   title: String,
   option: Schema.Types.Mixed,
   votes: [Number],
   date: Date
});

module.exports = mongoose.model("Poll", Poll);