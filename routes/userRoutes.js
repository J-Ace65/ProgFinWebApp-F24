const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const{getTradesByUser}=require('../controllers/tradeHistoryController')
const{getStockDetails}=require('../controllers/stockController')
const{getStockHistory}=require('../controllers/stockhistoryController')
const tradeController=require('../controllers/tradeController')
const{activetrade,totalpnl}=require('../controllers/portfolioController')
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

  router.get('/active-stocks',activetrade);

  router.get('/total-pnl',totalpnl );
  
  

module.exports = router;
