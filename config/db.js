var mongoose=require("mongoose");

var initiatemongo=()=>{
    
    
    const uri = "mongodb+srv://admin:Shivu1997@cluster0.m5aap.azure.mongodb.net/employee1?retryWrites=true&w=majority";
    
            mongoose.connect(uri || process.env.MONGODB_URI  || "mongodb://localhost:27017/employee1",{
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



