const AdminBro = require('admin-bro');
const AdminBroExpress = require('admin-bro-expressjs');

const AdminBroMongoose=require("admin-bro-mongoose");
const mongoose=require("mongoose");

AdminBro.registerAdapter(AdminBroMongoose);
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: '/admin',
})

const ADMIN={
    email:process.env.ADMIN_EMAIL || "admin@example.com",
    password:process.env.ADMIN_PASSWORD || "lovejs",
}

//for authentication npm install express-session cookie-parser
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro,{
    cookieName: process.env.ADMIN_COOKIE_NAME || "admin-bro",
    cookiePassword:process.env.ADMIN_COOKIE_PASS || "super-super",
    authenticate:async(email,password)=>{
        if(email===ADMIN.email && password==ADMIN.password){
            return ADMIN
        }
        else{
            return null
        }

    }
});
module.exports=router;