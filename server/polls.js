"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Poll = new Schema({
   title: String,
   options: Schema.Types.Mixed,
   date: Date
}, { versionKey: false });

module.exports = mongoose.model("Poll", Poll);