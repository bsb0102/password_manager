// emailUtils.js
const nodemailer = require("nodemailer");
const fs = require("fs");
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: "smtp.eu.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

const sendLoginNotification = (to, IP_ADDRESS) => {
  const templatePath = '/root/password_manager/backend/services/templates/loginAttempt.html'; // Hardcoded path to the template file

  // Read HTML template from file
  fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading template file:", err);
      return;
    }

    // Replace placeholders with provided parameters
    const html = data
      .replace('{{ACCOUNT_EMAIL}}', to)
      .replace('{{CURRENT_DATE}}', new Date().toLocaleString())
      .replace('{{IP_ADDRESS}}', IP_ADDRESS);

    const mailOptions = {
      from: "noreply@noreply.safekey.gg",
      to: to,
      subject: "Login Attempt Notification",
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent successfully!", info.response);
      }
    });
  });
};


const sendVerificationCodeEmail = (to, verificationCode) => {
  const templatePath = '/root/password_manager/backend/services/templates/verificationEmail.html'; // Path to the verification email template file

  // Read HTML template from file
  fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading verification email template file:", err);
      return;
    }

    // Replace placeholders with provided parameters
    const html = data
      .replace('{{VERIFICATION_CODE}}', verificationCode);

    const mailOptions = {
      from: "noreply@noreply.safekey.gg",
      to: to,
      subject: "Verification Code",
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error("Error sending verification email:", error);
      } else {
        console.log("Verification email sent successfully!");
      }
    });
  });
};

const sendSuccessEmailMFAEmail = (to) => {
  const templatePath = '/root/password_manager/backend/services/templates/SuccessE-MFA.html'; // Path to the verification email template file

  fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading verification email template file:", err);
      return;
    }

    // Replace placeholders with provided parameters
    const html = data
      .replace('{{EMAIL_MFA_ACTIVATION}}', to);

    const mailOptions = {
      from: "noreply@noreply.safekey.gg",
      to: to,
      subject: "Enabled Multifactor Authentication",
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error("Error sending verification email:", error);
      } else {
        console.log("Verification email sent successfully!");
      }
    });
  });
};


const sendPasswordResetEmail = (to, resetPasswordLink) => {
  const templatePath = '/root/password_manager/backend/services/templates/resetPassword.html'; // Path to the password reset email template file

  // Read HTML template from file
  fs.readFile(templatePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading password reset email template file:", err);
      return;
    }

    // Replace placeholders with provided parameters
    const html = data
      .replace('{{RESET_PASSWORD_LINK}}', resetPasswordLink);

    const mailOptions = {
      from: "noreply@noreply.safekey.gg",
      to: to,
      subject: "Password Reset Instruction",
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error("Error sending password reset email:", error);
      } else {
        console.log("Password reset email sent successfully!");
      }
    });
  });
};

module.exports = { 
  sendLoginNotification, 
  sendVerificationCodeEmail,
  sendPasswordResetEmail,
  sendSuccessEmailMFAEmail
};
