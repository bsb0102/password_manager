const { sendLoginNotification } =  require("./mailgunService");

const toEmail = "entitiplayer@gmail.com";
const params = {
  ACCOUNT_EMAIL: "example@example.com",
  IP_ADDRESS: "192.168.1.1"
};
sendLoginNotification(toEmail, params);