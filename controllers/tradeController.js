const db = require('../confiq/db');

const tradeController = {
  saveTrade: async (req, res) => {
    const { user_id, symbol, price_per_share, quantity, total_price, buy_time, trade_count } = req.body;

    try {
      // Format buy_time to MySQL DATETIME format
      const formattedBuyTime = new Date(buy_time).toISOString().slice(0, 19).replace('T', ' ');
      const status = 'active'; // Default status
      const pnl = 0; // Default P&L (profit/loss)

      // Use Promise-based query
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
        formattedBuyTime, // Use formatted datetime
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
