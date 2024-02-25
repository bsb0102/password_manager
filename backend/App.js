
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const passwordRoutes = require('./routes/passwordRoutes');
const secretNodesRoutes = require('./routes/secretNodeRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const connectDB = require('./database');
const mailGunService = require("./services/mailgunService")
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
env = module.exports = process.env;
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const app = express();

const corsOptions = {
  origin: ['https://localhost:443', 'https://82.165.221.131:443', 'http://localhost:3000', 'https://safekey.gg:443/api'], // Add your frontend URL here
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Define the rate limit options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


app.use(limiter);

// Remove the API_BASE_URL prefix from here
app.use('/api', authRoutes);
app.use("/api", passwordRoutes);
app.use('/api', mfaRoutes);
app.use('/api', secretNodesRoutes);

// Static file serving for production frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
    });
}


app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Connect to Database
connectDB();
// Global error handler
app.use(errorHandler);

console.log("Started Backend Server")
module.exports = app;
