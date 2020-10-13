// department schema
var mongoose=require("mongoose");

var nameSchema=new mongoose.Schema({
   
    department_name:String,
    department_id:Number
    


    });
    //model
    module.exports=mongoose.model("department",nameSchema);