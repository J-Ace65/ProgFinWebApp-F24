const db = require('../confiq/db');

const tradeController = {
  saveTrade: async (req, res) => {
    const { user_id, symbol, price_per_share, quantity, total_price, buy_time, trade_count } = req.body;

    try {

      const formattedBuyTime = new Date(buy_time).toISOString().slice(0, 19).replace('T', ' ');
      const status = 'active'; 
      const pnl = 0; 


      const query = `
        INSERT INTO trade (user_id, symbol, price_per_share, quantity, total_price, buy_time, trade_count, status, pnl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(query, [
        user_id,
        symbol,
        price_per_share,
        quantity,
        total_price,
        formattedBuyTime, 
        trade_count,
        status,
        pnl,
      ]);

      res.status(200).json({ message: 'Trade saved successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to save trade' });
    }
  }
};

module.exports = tradeController;
