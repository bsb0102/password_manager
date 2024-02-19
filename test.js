var api_key = 'pubkey-2010534ae9bc367b78ada2b6aa55afe4';
var domain = 'noreply.safekey.gg';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'Excited User <me@noreply.safekey.gg>',
  to: 'serobnic@mail.ru',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};
 
mailgun.messages().send(data, function (error, body) {
  console.log(error);
});