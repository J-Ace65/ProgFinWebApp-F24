const pool = require('../confiq/db'); // Assuming the `mysql2/promise` connection is exported from this file

const getTradesByUser = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('User not logged in.');
    }
    try {
        const sql = 'SELECT * FROM trade WHERE user_id = ?';
        const [results] = await pool.query(sql, [userId]); // Use await with pool.query for Promise-based API

        res.status(200).json(results); // Send the query results as JSON
    } catch (err) {
        console.error('Database error:', err); // Log the error for debugging
        res.status(500).send('Database error'); // Send a generic error response
    }
};

module.exports = { getTradesByUser };
