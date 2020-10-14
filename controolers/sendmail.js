var nd = require("nodemailer");

var y = function (mail, b) {
  var tr = nd.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: "ucantseemethor@gmail.com",
      pass: "Shivaraj1234",
    },
  });
  var ma = {
    from: "ucantseemethor@gmail",
    to: mail,
    subject: "Node Mail",
    text: b,
  };
  tr.sendMail(ma, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log("Email Sent Successfully :" + data.response);
    }
  });
};
module.exports = y;
