var mongoose=require("mongoose");

var initiatemongo=()=>{
            mongoose.connect("mongodb://localhost:27017/employee1",{
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

        var db=mongoose.connection;
        db.on("error",()=>{
        console.log("connection error");
        });
        db.once("open",function(){
        console.log("connected");
        console.log("database name used is:"+db.name);

});
};

module.exports=initiatemongo;



