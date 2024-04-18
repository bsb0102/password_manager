const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.eu.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: "postmaster@safekey.gg",
    pass: "e9996cfd6499839df3a9db478c9fe4b5-19806d14-fbfb8e88"
  },
  headers: {
    "X-PM-Message-Stream": "safekey"
  }
});

const mailOptions = {
    from: "noreply@noreply.safekey.gg",
    to: "test@gmail.com",
    subject: "Login Attempt Notification",
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Login Email sent successfully! ", info);
    }
  });