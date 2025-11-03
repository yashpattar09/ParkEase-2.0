const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const userRoutes = require('./routes/users');
const bookingRoutes = require('./routes/bookings');
const locationRoutes = require('./routes/locations');

// Import database
require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/locations', locationRoutes);

// Serve frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/booking', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/booking.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/profile.html'));
});

app.get('/parking-locations', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/parking location.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`🌐 Network access: http://YOUR_IP_ADDRESS:${PORT}`);
    console.log('ParkEase Backend API is ready!');
});
