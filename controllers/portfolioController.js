const pool=require('../confiq/db')


const activetrade = async (req, res) => {
  const userId = req.session.userId; // Retrieve the userId from the session

  if (!userId) {
      return res.status(401).json({ error: 'User not logged in' });
  }

  try {
      // Query to count rows where status is "Active" and matches the userId
      const result = await pool.execute(
          `SELECT COUNT(*) AS active_count FROM trade WHERE status = 'Active' AND user_id = ?`,
          [userId]
      );

      // console.log('Query result:', result); 

      const [rows] = result;
  
      res.json({
          activeStocks: rows[0]?.active_count || 0,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching active stocks' });
  }
};

const totalpnl = async (req, res) => {
  const userId = req.session.userId; // Retrieve userId from the session

  if (!userId) {
      return res.status(401).json({ error: 'User not logged in' }); // Return if user is not logged in
  }

  try {
      // Query to sum the PnL for the specific user
      const [rows] = await pool.execute(
          `SELECT SUM(pnl) AS total_pnl FROM trade WHERE status = 'Active' AND user_id = ?`,
          [userId] // Pass userId as a parameter
      );

      // Ensure totalPnl is always a number
      const totalPnl = rows[0]?.total_pnl || 0; 
      res.json({ totalPnl });
  } catch (error) {
      console.error('Error fetching total PnL:', error);
      res.status(500).json({ error: 'An error occurred while fetching total PnL' });
  }
};
// user's name
const getUsername=(req, res) => {
  const userId = req.session.userId;

  if (!userId) {
      return res.status(401).json({ error: 'User not logged in' });
  }

  pool.execute('SELECT username FROM user WHERE id = ?', [userId])
      .then(([rows]) => {
          if (rows.length === 0) {
              return res.status(404).json({ error: 'User not found' });
          }
          const username = rows[0].username;
          res.json({ username });
      })
      .catch((err) => {
          console.error('Error fetching user info:', err);
          res.status(500).json({ error: 'An error occurred while fetching user info' });
      });
};



  module.exports={
    activetrade,
    totalpnl,
    getUsername
  }
