const express = require('express');
const cors = require('cors');
const errorHandler = require('./backend/middleware/errorHandler');
const authRoutes = require('./backend/routes/auth');
const passwordRoutes = require('./backend/routes/passwordRoutes');
const mfaRoutes = require('./backend/routes/mfaRoutes');
const connectDB = require('./backend/database');
const path = require('path');
const http = require('http');
const https = require('https');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const fs = require('fs');

const app = express();
dotenv.config();

// Set up middleware
const corsOptions = {
  origin: "*", // Erlaube alle Ursprünge
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

// Static file serving for production frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './frontend/build/index.html'));
    });

    // Load SSL/TLS certificate and private key
    const privateKeyPath = '/etc/letsencrypt/live/safekey.gg/privkey.pem';
    const certificatePath = '/etc/letsencrypt/live/safekey.gg/fullchain.pem';
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const certificate = fs.readFileSync(certificatePath, 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    // Create HTTPS server
    const PORT = process.env.PORT || 443;
    const server = https.createServer(credentials, app);
    server.listen(PORT, () => {
        console.log(`Server is running on HTTPS port ${PORT}`);
    });
} else {
    // Development mode
    app.use(express.static(path.join(__dirname, './frontend/public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './frontend/public/index.html'));
    });

    // Test if process.env.NODE_ENV is set to 'developing'
    if (process.env.NODE_ENV === 'developing') {
        const PORT = process.env.DEV_PORT || 3000; // Standard-Port 3000 für Entwicklung
        const server = http.createServer(app);
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } else {
        const PORT = process.env.DEV_PORT || 3001; // Standard-Port 3001 für Entwicklung
        const server = http.createServer(app);
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
}

// Connect to Database
connectDB();

// Global error handler
app.use(errorHandler);

module.exports = app;
