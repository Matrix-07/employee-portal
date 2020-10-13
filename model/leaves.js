// user schema
var mongoose=require("mongoose");

var nameSchema=new mongoose.Schema({
  
    email:String,
    department_name:String,
    department_id:String,
    fromdate:String,
    todate:String,
    leavetype:String,
    leavestatus:String,
    remarks:String


    });
    //model
    module.exports=mongoose.model("leaves",nameSchema);