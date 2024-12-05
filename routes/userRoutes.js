const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const{getTradesByUser}=require('../controllers/tradeHistoryController')
const{getStockDetails}=require('../controllers/stockController')
const{getStockHistoryController}=require('../controllers/stockhistoryController')
const tradeController=require('../controllers/tradeController')
const{activetrade,totalpnl, getUsername}=require('../controllers/portfolioController')
const db = require('../confiq/db');

const router = express.Router();

// registration route
router.post('/register', registerUser);
//login router
router.post('/login', loginUser);
//tradehistory of user
router.get('/tradehistory', getTradesByUser);
// Route to fetching interday stock details
router.get('/stock/:symbol', getStockDetails);

// Route to fetching stockhistory details
router.post('/save', tradeController.saveTrade);

//router.get('/stockhistory/:symbol', getStockHistory);
router.get('/stockhistory/:symbol', getStockHistoryController);

  router.get('/active-stocks',activetrade);

  router.get('/total-pnl',totalpnl );
  router.get('/user-info', getUsername); 
  
  

module.exports = router;
