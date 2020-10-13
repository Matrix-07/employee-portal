// leave schema
var mongoose=require("mongoose");

var nameSchema=new mongoose.Schema({
    Fname:String,
    Lname:String,
    Department_name:String,
    Department_id:Number,
    leavetype:String,
    from:Date,
    to:Date,
    leave_status:String,
   leave_description:String,


    });
    //model
    module.exports=mongoose.model("leave",nameSchema);