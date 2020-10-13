
var department = require("D:/employee/employee/Ecommerce/model/department.js");
var employee = require("D:/employee/employee/Ecommerce/model/employee.js");
var leaves = require("D:/employee/employee/Ecommerce/model/leaves.js");

var leavetype = require("D:/employee/employee/Ecommerce/model/leavetype.js");
var emp_emails = require("D:/employee/employee/Ecommerce/model/emp_emails.js");
var bodyparser = require("body-parser");
var session = require("express-session");
var urlencodedParser = bodyparser.urlencoded({ extended: true });
var sendmail = require(__dirname + "/sendmail");

var x = function (app) {
  /**it willl displat sendmail page */
  app.get("/sendmail", function (req, res) {
    /**only admin can send mail else redirect to main page */
    if(req.session.email=="admin@example.com"){
      /**get all employee and sent it to ejs to diplay and mail will be sent to chosses users */
      employee.find({},function(err,data){
        if(err){
          res.send(err);
        }
        else{
          
          res.render("sendmail",{data});
        }
      })
   
    }
    else{
      res.redirect("/");
    }
  })
  /*post router of sendmail send mail to selected employee in checkbox */
  app.post("/sendmail", urlencodedParser,function (req, res) {
    /*only admin can send mail so session should have admin logged in else redirect to main page*/ 
    if(req.session.email=="admin@example.com"){
      
      /*data accessed through checkmail stored in the form of list */
     var email=[req.body.email];
     var text=req.body.text;

     /*each email in a list will receive mail*/
     for(let i=0;i<email.length;i++)
     {
       sendmail(email[i],text);
       
        
    
     }
     res.end();
    
    }
    else{
      res.redirect("/");
    }
  })
/*it has log in and signup form */
  app.post("/signup", urlencodedParser, function (req, res) {
    /*session will be created.so that there willl be no redundancy and only particular user can make change to his profile*/ 
    req.session.email = req.body.email;/*session mail*/
    req.session.password = req.body.password;
    var data = req.body;
    
    var path = req.path;
    var exist = 0;
    /*emplopyee with respective email will be searched from database .if exists then he willl be logged in else redirect to login page again */
    employee.find({ email: data.email }, function (err, doc) {
      if (doc.length) {
        exist = 1;
      } else {
        exist = 0;
      }
/*if he clicked login button */
      if (data.submittype == "login") {
        /*if employee exists */
        if (exist == 1) {
          employee.find({ email: data.email, pass: data.password }, function (
            err,
            doc
          ) {
            if (doc.length) {
              /*if admin login and admin page will be rendered */
              if (req.body.email == "admin@example.com") {
                res.redirect("/admin_page");
              }
              else {
                /*user page will be rendered */
                res.redirect("/main");
              }

            } else {
              /*if password entered is incorrect */
              let text = "Enter correct password";
              res.render("logger", { path, text })
            }
          });
        } else {
/*if email is incorrect will be rendred to login page*/ 
          let text = "Enter correct email";
          res.render("logger", { path, text })
        }
      } else {

/*if button submitt type is signup (add employee in this case which is used onbly by admin) */
        res.render("signup-form", { path, data });
      }
    });
  });
  /*it diplay the profile of user */
  app.get("/profile", function (req, res) {
    var path = req.path;
    /*it will be diplayed only if user have session else redirected to login page */
    if (req.session.email) {
      /*get emplotyee data of respective employtees */
      employee.find({ email: req.session.email }, function (err, data1) {
      
        var data = data1[0];
        /*render [profilke.ejs and send data to ejs template to display */
        res.render("profile", { data, path });
      })


    }
    else {
      res.redirect("/");
    }

  });
/*edit the profile */
  app.get("/editProfile", urlencodedParser, function (req, res) {
 
    var path = req.path;
    if(req.session.email){
    /*get the data of user */
    employee.find({ email: req.session.email }, function (err, data1) {

    
      var data = data1[0];
      res.render("profile", { data, path });

    });
  }
  else{
    res.redirect("/");
  }

  });
  /*update profile after editing */
  app.post("/updateProfile", urlencodedParser, function (req, res) {

    var data = req.body;
    /*find the employee in database and update the changes */
    if(req.session.email){
    employee.updateOne(
      { "email": req.session.email }, data, { upsert: true }, function (err, result) {
        if (err) {
          res.send(err);
        }
        else {
          /*after update redirected toi profile page */
          res.redirect("/profile");

        }

      });
    }
    else{
      res.redirect("/");
    }
  });
/*it is a home page of user and admin */
  app.get("/main", function (req, res) {
    /**onlu if session is crested then it will be displayed else redirected to main page */
    if (req.session.email) {

      res.render("main");
    }
    else {
      res.redirect("/");
    }
  });
  /*admin can check leave status of currently applied leave */
  app.post("/leavestatus", urlencodedParser, function (req, res) {
    if (req.session.email) {
      var data2 = req.body;
      var path=req.path;

      employee.find({ email: req.session.email }, function (err, data1) {
        var data3 = data1[0]._doc;
        department.find({ department_name: data3.department_name }, function (err, data4) {
          if (err) {
            let text="could not find";
           res.render("error",{text,path})
          }
          else {
            if (data4.length != 0) {
              var data5 = data4[0]._doc;
              var leavestatus = { "leavestatus": "pending" };
              var data = Object.assign({}, data3, data2, data5, leavestatus);
             
              var leaves_data = new leaves(data);
              leaves_data
                .save()
                .then(() => {
                  
                  res.redirect("/applyleave");
                })
                .catch((err) => {
                  res.status(400).send(err);
                });


            }
            else {
              
              let text="Couldnot find The Employeeassociated withdepartment id.Enter correct value ";
              res.render("error",{text,path});
            }
          }

        })

      })
    }
    else {
      res.redirect("/");
    }

  })
  /*this will get the detailes of a user who applied leave */
  app.get("/getleave", function (req, res) {
    if (req.session.email) {
      /**leaves of a particular user will be found ihn leaves database and data is rendered */
      leaves.find({}, function (err, data) {
        
        res.render("approveleave", { data });
      })
    }
    else {
      /**if session is not initiated it willl be redirected to login page */
      res.redirect("/");
    }

  })
  /**check all leaves applied and can rejecct or approve */
  app.post("/approved", urlencodedParser, function (req, res) {
    /**only admin can accesss */
    if (req.session.email == "admin@example.com") {
/**get leave applied from database and change will be carried out accordingly .update leavestatus and display same*/
      leaves.updateOne({ email: req.body.email }, { $set: { leavestatus: req.body.leavestatus } }, function (err, data1) {
        leaves.find({}, function (err, data) {

          res.render("approveleave", { data });
        })

      })
    }
    else {
      res.redirect("/");
    }

  })
  /**employee can apply leave */
  app.get("/applyleave", function (req, res) {
    /*user must be logged in to access this page*/
    if (req.session.email) {
      /*leaves of particular employee will be diapled along with his other details*/
      leaves.find({ email: req.session.email }, function (err, data1) {
        employee.find({ email: req.session.email }, function (req, data2) {

          var data;
          var length = data1.length;
          if (data1.length == 0 || data2.length == 0) {
            res.render("leaveform", { data, length })
          }
          else {
            /**this merge two objects data1 and data2  */
            data = Object.assign({}, data1[0]._doc, data2[0]._doc);
            res.render("leaveform", { data, length })
          }

        })
      })
    }
    else {
      /**if not logged in redirect to main page */
      res.redirect("/");
    }

  });
/**user can edit leave that he has applied */
  app.get("/editleave", function (req, res) {
    if (req.session.email) {
/**get the details of leave he applied  */
      leaves.find({ email: req.session.email }, function (err, data1) {

        var data = Object.assign({}, data1[0]._doc, req.query);
  
        res.render("editleave", { data })
      })
    }
    else {
      /**if sessionj is not initiated redirect toi main page */
      res.redirect("/");
    }

  })

  app.get("/getemployees", function (req, res) {
    var path=req.path;
    if (req.session.email) {
      employee.find({}, function (err, data) {
        if (err) {
         let text=err;
          res.render("error",{path,text});
        }
        else {
          res.render("getemployee", { data })
        }
      })
    }
    else {
      res.redirect("/");
    }

  })

  /*temproray emails to send log in informatrion for employee to log in */
  app.get("/temp_mail", function (req, res) {
    var path=req.path;
    if (req.session.email=="admin@example.com") {
      emp_emails.find({}, function (err, data) {
        if (err) {
         let text=err;
          res.render("error",{path,text});
        }
        else {
          res.render("temp_emails", { data })
        }
      })
    }
    else {
      res.redirect("/");
    }

  })
  /*add new employee to database */
  app.get("/addemployee", function (req, res) {
    /**only admin can add else redirect to loggin page */
    if (req.session.email=="admin@example.com") {
      res.render("signup-form");
    }
    else {
      res.redirect("/");
    }
  })
  /**it is admin home page */
  app.get("/admin_page", function (req, res) {
    /**admin session is created */
    if (req.session.email == "admin@example.com") {
      res.render("admin_page");
    }
    else {
      res.redirect("/");
    }

  })


/*this will send log in formation to employees .email and password
Employee can login only after receiving login information*/
  app.post("/emp_emails", function (req, res) {
    var path=req.path;
    if (req.sesion.email == "admin@example.com") {
      emp_emails.find({}, function (err, data) {
        if (err) {
          let text=err;
          res.render("error",{path,text});

        }
        else {
          var length1 = data.length;

          for (let i = 0; i < length1; i++) {
            let b = '' + Math.floor((Math.random() * 1000000) + 54);
            sendmail(data[i].email, b);
            emp_emails.updateOne({ email: data[i].email }, { $set: { passw: b } }, function (err, data1) {
              var data2 = { "email": data[i].email, "pass": b };

              let mydata = new employee(data2);
              mydata
                .save()
                .then(() => {
                  let text="item saved to database";
          res.render("error",{path,text});
                })
                .catch((err) => {
                  let text="unable to save to database";
                  res.render("error",{path,text});
                });


            })
          }
        }

      })
    }
    else {
      res.redirect("/");
  }
  }

)
/**delete applied  leave */
  app.get("/deleteleave", function (req, res) {
    if(req.session.email){
      /**searchg for respective enmployee and then delete */
    leaves.deleteOne({ email: req.session.email }, function (err, data) {
      res.redirect("/applyleave")
    })
  }
  else{
    res.redirect("/");
  }
  })
  /**to update the leave applied */
  app.get("/updateleave", function (req, res) {
    if(req.session.leave){
    var data = req.query;
    /**update and make changes to database */
    leaves.updateOne(
      { email: req.session.email },
      {
        $set:
        {
          fromdate: data.fromdate,
          todate: data.todate,
          remarks: data.remarks,
          leavetype: data.leavetype
        }
      },
      function (err, data) {
        res.redirect("/applyleave");
      })
    }
    else{
      res.redirect("/");
    }
  })
  /**insert data to database */
  app.post("/insert", urlencodedParser, function (req, res) {
    var path=req.path;
    /**only admin can insert so admin session is created else redirected to login page */
    if(req.session.email=="admin@example.com"){
    var mydata = new employee(req.body);

    
    mydata
      .save()
      .then(() => {
        let text="item saved to database";
        res.render("error",{path,text});
      })
      .catch((err) => {
        let text="unable to save to database";
        res.render("error",{path,text});
      });
    }
    else{
      res.redirect("/");
    }

  });
/**reset password */
  app.get("/resetpassword", function (req, res) {
    res.render("resetpassword");
  })
/**entering coirrect otp and creating new password */
  app.post("/enterotp", urlencodedParser, function (req, res) {
    let data = req.body;
    var path=req.path;
    /**generate random number for otp */
    let b = '' + Math.floor((Math.random() * 1000000) + 54);
    /**find employee */
    employee.find({ email: data.email }, function (err, data1) {
      if (err) {
res.render("error",{path,text})
      }
      else {
/**if employee exist send otp else send invalid email */
        if (data1.length > 0) {
          sendmail(data.email, b);
          res.render("enterotp", { data, b });
        }
        else {
          let text="enter valid email";
                  res.render("error",{path,text});
          res.end();
        }
      }

    })

  })
  /**if otp entered is wrong send try again */
  app.post("/unsucess", function (req, res) {
    res.render("unsucess")
  })
  /**create password */
  app.post("/createpassword", urlencodedParser, function (req, res) {
    let data = req.body;
  
    res.render("createpassword", { data });
  })
  /**update password  */
  app.post("/created", urlencodedParser, function (req, res) {
    let data = req.body;
    var path=req.path;
    employee.updateOne({ email: data.email }, { $set: { pass: data.password } }, function (err, data1) {
      if (err) {
        let text="cannot be updated try again";
        res.render("error",{path,text});
      }
      else {
        res.render("passwordupdated");
      }
    })
  })
  /**search employee in database so search page will displayed */
app.get("/searchemployee",function(req,res){
  /**only admin can access database */
  if(req.session.email=="admin@example.com"){
    var length=0;
    var path="get";
  res.render("searchemployee",{length,path});
  }
  else{
    res.redirect("/");
  }
})
/**after entering name to be searched this method will be carried out. */
app.post("/searchemployee",urlencodedParser,function(req,res)
{

  if(req.session.email=="admin@example.com")
  {
        var data=req.body;
        var path="post";
        /**it will find employees and send it after searching from database */
      employee.find({email:data.email},function(err,data1)
      {
          
            if(err)
            {
              let text=err;
                  res.render("error",{path,text});
            }

            else
            {
              var length=data1.length;
              
              if(length==0)
              {
              
                res.render("searchemployee",{data,length,path});
              }
              else
              /**get department id of employee */
              department.find({ department_name: data1[0]._doc.department_name }, function (err, data4) 
              {
              {
                var data=Object.assign({}, data1[0]._doc, data4[0]._doc);
              
                res.render("searchemployee",{data:data,length,path})
                
              }
            })
              
            }
       
  
    })
}
else
{
  res.redirect("/");
}

})
/**settings page */
  app.get("/settings", function (req, res) {
    if(req.session.email)
{    res.render("main")
}
else{
  res.redirect("/");
}
  })
  /**contact in case of issues */
  app.get("/contact", function (req, res) {
    if(req.session.email){
    res.render("contact");
    }
    else{
      res.redirect("/");
    }
  })
};

module.exports = x;
