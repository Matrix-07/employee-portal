// temp employee database schema
var mongoose=require("mongoose");

var nameSchema=new mongoose.Schema({
    email:String,
    passw:String


    });
    //model
    module.exports=mongoose.model("emp_emails",nameSchema);