const db = require('../confiq/db');

const getTradesByUser = (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('User not logged in.');
    }

    const sql = 'SELECT * FROM trade WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).send('Database error');
        res.status(200).json(results);
    });
};

module.exports = { getTradesByUser };
