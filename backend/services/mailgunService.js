
require('dotenv').config();
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(formData);
const client = mailgun.client({username: 'api', key: API_KEY});


const sendEmail = async (to, subject, html) => {
  client.messages.create('noreply.safekey.gg', {
    from: "SafeKey <noreply@safekey.gg>",
    to: ["entitiplayer@gmail.com"],
    subject: "Hello",
    text: "Testing some Mailgun awesomness!",
    html: "<h1>Testing some Mailgun awesomness!</h1>"
  })
  .then(msg => console.log(msg))
  .catch(err => console.error(err));
};

const sendLoginNotification = async (ACCOUNT_EMAIL, IP_ADDRESS) => {
  const subject = 'Login Attempt';
  const templatePath = path.join(__dirname, './templates/loginAttempt.html');
  let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

  htmlTemplate = htmlTemplate
    .replace('{{ACCOUNT_EMAIL}}', ACCOUNT_EMAIL)
    .replace('{{CURRENT_DATE}}', new Date().toLocaleString())
    .replace('{{IP_ADDRESS}}', IP_ADDRESS);

  await sendEmail('recipient@example.com', subject, htmlTemplate);
};

module.exports = {
  sendEmail,
  sendLoginNotification,
};
