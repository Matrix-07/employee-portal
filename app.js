var express = require("express");
var cont=require(__dirname+"/controolers/controlapp");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
var admin= require(__dirname+"/model/admin.js");

var initiatemongo=require(__dirname+"/config/db");

var session=require("express-session");


//install admin bro to add admin panyel
// initiate connection
initiatemongo();
//restful API thru which data i added
var app = express();

app.set("view engine","ejs");
/**used admin panel to access database */
app.use("/admin",admin);
app.use(express.static( __dirname+ "/profile"));

app.set('trust proxy', 1);
 var k=   app.use(session({
      secret: 'keyboard cat'
      
    }));
    /**initial page of website */
app.get("/", function(req, res) {
  
  let path=req.path;
  let text="";
    res.render("logger",{path,text});
  
  
});


/*after loggin out session will be destroyed*/
app.get("/logout",function(req,res){
  req.session.destroy(function(err){
    if(err){
      res.negotiate(err);
    }
    else{
      res.redirect("/");
    }
  });
});


cont(app);
app.listen(process.env.PORT || 3000,function(){
  console.log('Express server listening on port %d',this.address().port);
})





