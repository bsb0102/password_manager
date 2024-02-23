
const FormData = require('form-data');
const fetch = require('node-fetch');

async function run() {
  const form = new FormData();
  form.append('from','string');
  form.append('to','string');
  form.append('subject','string');
  form.append('html','string');
// passwordmanager2024!
  const domainName = 'noreply.safekey.gg';
  const resp = await fetch(
    `https://api.mailgun.net/v3/${domainName}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from('<noreply@noreply.safekey.gg>:<passwordmanager2024!>').toString('base64')
      },
      body: form
    }
  );

  const data = await resp.text();
//   console.log(data);
}

run();

  