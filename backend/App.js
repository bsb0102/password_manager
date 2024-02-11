const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwordRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const connectDB = require('./database');
const path = require('path');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
dotenv.config();

// Load SSL/TLS certificate and private key
const privateKey = fs.readFileSync(path.resolve(__dirname, '/etc/letsencrypt/live/safekey.gg/privkey.pem'), 'utf8');
const certificate = fs.readFileSync(path.resolve(__dirname, '/etc/letsencrypt/live/safekey.gg/fullchain.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

// HTTPS options
const httpsOptions = {
  key: privateKey,
  cert: certificate
};

// Set up middleware
const corsOptions = {
  origin: "*",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

const csrfProtection = csrf({ cookie: true });

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define the rate limit options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Remove the API_BASE_URL prefix from here
app.use('/api', authRoutes);
app.use("/api", passwordRoutes);
app.use('/api', mfaRoutes);

// Static file serving for production frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    console.log(__dirname, '../frontend/build')
    app.get('*', (req, res) => {
      console.log(req)
      console.log(res)
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    });
}

// Connect to Database
connectDB();

// Set the PORT based on the environment
let PORT;
if (process.env.NODE_ENV === 'developing') {
    PORT = 3002;
} else {
    PORT = process.env.PORT || 443;
}

// Create HTTPS server
const server = https.createServer(httpsOptions, app);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
