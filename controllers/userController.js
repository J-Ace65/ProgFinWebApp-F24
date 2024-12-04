const bcrypt = require('bcrypt');

const pool = require('../confiq/db'); 
    // Assuming your database connection is in a `config/db.js` file

// Function to handle user registration

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const sql = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
        try {
            const [result] = await pool.query(sql, [username, email, hashedPassword]);
            res.status(201).send('User created successfully.');
        } catch (err) {
            // Check for duplicate entry error
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).send('User already exists.'); // HTTP 409 Conflict
            }

            console.error('Database error:', err);
            return res.status(500).send('Database error.');
        }
    } catch (err) {
        console.error('Error processing request:', err);
        res.status(500).send('Internal server error.');
    }
};





// Login function


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const sql = 'SELECT * FROM user WHERE email = ?';
        const [results] = await pool.query(sql, [email]);

        if (results.length === 0) {
            return res.status(401).send('Invalid email or password');
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid email or password');
        }

        // Store the user ID in session
        req.session.userId = user.id;

        res.status(200).json({ message: 'Login successful', userId: user.id });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal server error.');
    }
};


module.exports = { registerUser, loginUser };
