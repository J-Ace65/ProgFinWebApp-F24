const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(express.json()); // Middleware for JSON parsing

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));



// API Routes
app.use('/api/users', userRoutes);

// Routes for specific pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/home.html')); // Serve the home page
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/login.html')); // Serve the login page
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/register.html')); // Serve the registration page
});
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/dashboard.html'));
});
app.get('/watchlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/watchlist.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
