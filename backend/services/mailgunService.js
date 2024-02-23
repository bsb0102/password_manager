
require('dotenv').config();
const formData = require('form-data');
const mailgun = require("mailgun-js");
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mg = mailgun({apiKey: "bf1d632514e6f4d170112f1f106a860d-408f32f3-46b138a7", domain: "noreply.safekey.gg"});


const sendEmail = async (to, subject, html) => {
  console.log("Sending Email 2", mg)
  const data = {
    from: "SafeKey <noreply.safekey.gg>",
    to: "entitiplayer@gmail.com",
    subject: "Login Alert",
    html: '<p>Dies ist eine Test-E-Mail von SafeKey.</p>',
  };

  mg.messages().send(data, function (error, body) {
    console.log("")
  });


};

const sendLoginNotification = async (ACCOUNT_EMAIL, IP_ADDRESS) => {
  const subject = 'Login Attempt';
  const templatePath = path.join(__dirname, './templates/loginAttempt.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  htmlTemplate = htmlTemplate
    .replace('{{ACCOUNT_EMAIL}}', ACCOUNT_EMAIL)
    .replace('{{CURRENT_DATE}}', new Date().toLocaleString())
    .replace('{{IP_ADDRESS}}', IP_ADDRESS);

  console.log("Sending Email 1")

  // await sendEmail('recipient@example.com', subject, htmlTemplate);
};

module.exports = {
  sendEmail,
  sendLoginNotification,
};
