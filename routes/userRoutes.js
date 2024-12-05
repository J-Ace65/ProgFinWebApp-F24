userRoutes.js
const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const{getTradesByUser}=require('../controllers/tradeHistoryController')
const{getStockDetails}=require('../controllers/stockController')
const{getStockHistory}=require('../controllers/stockhistoryController')
const tradeController=require('../controllers/tradeController')
const db = require('../confiq/db');

const router = express.Router();

// registration route
router.post('/register', registerUser);
//login router
router.post('/login', loginUser);
//tradehistory of user
router.get('/tradehistory', getTradesByUser);
// Route to fetching stock details
// Route to fetching interday stock details
router.get('/stock/:symbol', getStockDetails);

// Route to fetching stockhistory details
router.post('/save', tradeController.saveTrade);

//router.get('/stockhistory/:symbol', getStockHistory);
router.get('/stockhistory/:symbol', async (req, res) => {
    const { symbol } = req.params;
    try {
      const stockhistoryData = await getStockHistory(symbol);
      res.status(200).json(stockhistoryData);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stock data' });
    }
  });

  router.get('/active-stocks', async (req, res) => {
    try {
      // Query to count rows where status is "Active"
      const result = await db.execute(
        `SELECT COUNT(*) AS active_count FROM trade WHERE status = 'Active'`
      );

      console.log('Query result:', result); // Log the raw result

      const [rows] = result;
  
      res.json({
        activeStocks: rows[0]?.active_count || 0, // Default to 0 if no active rows
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching active stocks' });
    }
  });
module.exports = router;
