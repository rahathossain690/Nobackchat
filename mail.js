const nodemailer = require('nodemailer');
require('dotenv').config()
const fs = require('fs')
 // incomplete
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

module.exports.send_verification_mail = (data) => {
    
    var mailOptions = {
        from: process.env.email,
        to: data.email,
        subject: 'Verification mail',
        text: "Hello! \n Your email verification link: " + data.link + " \nHave a good day. \n \nSincerely \nDevekopers' Team"
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}