// user schema
var mongoose = require("mongoose");

var nameSchema = new mongoose.Schema({
  email: String,
  issue: String,
});
//model
module.exports = mongoose.model("report", nameSchema);
