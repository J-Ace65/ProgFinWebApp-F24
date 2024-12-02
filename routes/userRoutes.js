const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const{getTradesByUser}=require('../controllers/tradeHistoryController')


const router = express.Router();

// registration route
router.post('/register', registerUser);
//login router
router.post('/login', loginUser);
//tradehistory of user
router.get('/tradehistory', getTradesByUser);
// Route to fetching stock details
module.exports = router;
