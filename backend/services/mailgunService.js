
require('dotenv').config();
const mailgun = require('mailgun-js');
const fs = require('fs');
const path = require('path');

const apiKey = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;

const mg = mailgun({ apiKey, domain });

const sendEmail = async (to, subject, html) => {
  const data = {
    from: 'Your Name <your@email.com>',
    to,
    subject,
    html,
  };

  try {
    await mg.messages().send(data);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
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
