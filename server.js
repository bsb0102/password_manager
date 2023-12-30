const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Require the 'fs' module to read the certificate files
const errorHandler = require('./backend/middleware/errorHandler');
const authenticateToken = require('./backend/middleware/authenticateToken');
const https = require('https'); // Require the 'https' module

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB (adjust the connection string and options as needed)
mongoose
  .connect('mongodb://localhost/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define and mount your routes
const routes = require('./backend/routes/index.js');
app.use('/', routes);

app.use('/api/auth', require('./backend/routes/auth'));

app.get('/protected', authenticateToken, (req, res) => {
  res.send('Protected route accessed!');
});

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

app.use(errorHandler);

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}).listen(80);

const options = {
  key: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.key'),
  cert: fs.readFileSync('/etc/nginx/ssl/nginx-selfsigned.crt'),
};

https.createServer(options, app).listen(443);

httpsServer.listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
  console.log(`URL: https://localhost:${PORT}`);
});

// Handle process termination
process.on('SIGINT', () => {
  httpsServer.close(() => {
    console.log('HTTPS Server terminated.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});
