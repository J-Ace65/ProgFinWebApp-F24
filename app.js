const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');


const app = express();

app.use(session({
    secret: 'tea', // Change this to a strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 60*60*1000
     } // Set to true if using HTTPS
}));

app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
// API Routes
app.use('/api/users', userRoutes);
app.use('/api/stocks', userRoutes); //added this
app.use('/api/trade', userRoutes);

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
app.get('/watchlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/watchlist.html'));
});
app.get('/stockhistory', (req, res)=>{
    res.sendFile(path.join(__dirname,'public/pages/stockhistory.html'))
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
