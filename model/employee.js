// user schema
var mongoose=require("mongoose");

var nameSchema=new mongoose.Schema({
    Fname:String,
    Lname:String,
    email:String,
    birthdate:String,
    pass:String,
    country:String,
    mobilenumber:String,
    state:String,
    joindate:String,
    department_name:String


    });
    //model
    module.exports=mongoose.model("employee",nameSchema);