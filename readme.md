<h1>INTEGRATED EMPLOYEE PORTAL </h1> 
                          
<p>  This Is a Web based integrted employee project.It is built using HTML,CSS,Javascript,Expressjs,mongodb and nodejs.
                It has auto Integrated admin panel for node js (i.e Admin bro).It help in CRUD operation from one admin panel easily.</p>
                          
                       
<h1>Functionalities</h1>
                 
                 
                          
<p> Initially Assuming thast employee  has cleared the interview and is ready to join an organization.So all the emails of employeees mails have been stored in   temporary employees database.
                          admin will send the login credential to those emails in temporary emails databse.<br>We use nodemailer module in node.js to send mail.
                          once they login credentail is sent employee can login and update their respective profile and same will be updated in database<p>
                          
<h2> Admin panel functionality:</h2>
                          1) create,update,delete employee data from database.<br>
                          2)modify leave applied by employee.(either reject or approve)<br>
                          3)get all the employees and leaves and their information<br>
                          4)send mail to each employee when required<br>
                          
<h2>Employee panel functionality:</h2>
                          1)Read and update their respective profile..They dont have any right to create and delete any employee information from database.<br>
                          2)they can apply leave and modify the same before it is either rejected or approved from pending status.<br>
                          3)he can contact the admin in case of emergency and any issues regarding his profile updation and misinformation.through contact page
                          
<h2>Other functionality:</h2>
                          1)forgot passord:
                          employees can click on this and after authentication they can update password.otp will be sent to respective email using nodemailer.<br>
                          
                          
                          
<h2>How to run this project:</h2>
                          <br>
                          1)install nodejs and mongodb globally and set environment path (you can install robo 3t or studio 3t for mongodb)
                          2)clon the project using git clone <br>
                          2)go to the folder where you have this project<br>
                          3)run "nodemon app.js"<br>
                          4)if you get en error regarding nodemodules..run npm install and then run "nodemon app.js"<br>
                          
                          
                          
                          
                          
