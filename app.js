const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');


const app = express();

app.use(session({
    secret: 'tea', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// API Routes
app.use('/api/users', userRoutes);

// Routes for specific pages
//homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/home.html'));
});
//login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/login.html'));
});
//registeration
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/register.html'));
});
//dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/dashboard.html'));
});
//tradehistory of user page
app.get('/tradehistory', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/tradehistory.html'))
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
