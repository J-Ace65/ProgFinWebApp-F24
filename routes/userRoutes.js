const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { getStockDetails } = require('../controllers/stockController');
const{getTradesByUser}=require('../controllers/tradeHistoryController')


const router = express.Router();

// registration route
router.post('/register', registerUser);

//login router
router.post('/login', loginUser);
router.get('/tradehistory', getTradesByUser);


// Route to fetching stock details
router.get('/stock/:symbol', getStockDetails);
module.exports = router;
