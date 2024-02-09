const express = require('express');
const cors = require('cors');
const errorHandler = require('./backend/middleware/errorHandler');
const authRoutes = require('./backend/routes/auth');
const passwordRoutes = require('./backend/routes/passwordRoutes');
const mfaRoutes = require('./backend/routes/mfaRoutes');
const connectDB = require('./backend/database');
const path = require('path');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();
dotenv.config();

// Load SSL/TLS certificate and private key
const privateKeyPath = '/etc/letsencrypt/live/safekey.gg/privkey.pem';
const certificatePath = '/etc/letsencrypt/live/safekey.gg/fullchain.pem';
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Set up middleware
const corsOptions = {
  origin: ["https://safekey.gg"], // Add your frontend URL here
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
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

// import "./frontend/build/index.html"
// Static file serving for production frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './frontend/build/index.html'));
    });
}

// Connect to Database
connectDB();

// Global error handler
app.use(errorHandler);

// Create HTTPS server
const PORT = process.env.PORT || 443;
const server = https.createServer({ ...credentials }, app);
server.listen(PORT, 'safekey.gg', () => {
    console.log(`Server is running on HTTPS port https://safekey.gg:${PORT}/`);
});

module.exports = app;
