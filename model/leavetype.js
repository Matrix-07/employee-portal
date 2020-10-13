// leavetype  schema
var mongoose=require("mongoose");

var nameSchema=new mongoose.Schema({
   
    
    leavetype:String


    });
    //model
    module.exports=mongoose.model("leavetype",nameSchema);