const pool=require('../confiq/db')


const activetrade= async (req, res) => {
    try {
      // Query to count rows where status is "Active"
      const result = await pool.execute(
        `SELECT COUNT(*) AS active_count FROM trade WHERE status = 'Active'`
      );

      console.log('Query result:', result); 

      const [rows] = result;
  
      res.json({
        activeStocks: rows[0]?.active_count || 0,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching active stocks' });
    }
  };
  const totalpnl= async (req, res) => {
    try {
      // Query to sum the PnL
      const [rows] = await pool.execute(
        `SELECT SUM(pnl) AS total_pnl FROM trade WHERE status = 'Active'`
      );
      // Ensure totalPnl is always a number
      const totalPnl = rows[0]?.total_pnl || 0; 
      res.json({ totalPnl });
    } catch (error) {
      console.error('Error fetching total PnL:', error);
      res.status(500).json({ error: 'An error occurred while fetching total PnL' });
    }
  }

  module.exports={
    activetrade,
    totalpnl
  }
