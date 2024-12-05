
const yahooFinance = require('yahoo-finance2').default;
const pool = require('../confiq/db'); // MySQL connection pool
const getTradesByUser = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).send('User not logged in.');
    }
    try {
        // Step 1: Fetch all trades for the user
        const sql = 'SELECT * FROM trade WHERE user_id = ?';
        const [trades] = await pool.query(sql, [userId]);

        // Step 2: Extract unique symbols from the trades
        const uniqueSymbols = [...new Set(trades.map((trade) => trade.symbol))];

        // Step 3: Fetch current prices for all symbols in bulk
        const prices = {};
        try {
            const quoteResponse = await yahooFinance.quote(uniqueSymbols);
            quoteResponse.forEach((quote) => {
                prices[quote.symbol] = quote.regularMarketPrice;
            });
        } catch (error) {
            console.error('Error fetching stock prices:', error.message);
        }

        // Step 4: Match trades with fetched prices and update PnL
        for (const trade of trades) {
            const { trade_id, symbol, price_per_share, quantity } = trade;

            if (!prices[symbol]) {
                console.warn(`No current price for symbol ${symbol}. Skipping PnL update for trade_id ${trade_id}.`);
                continue;
            }
            const current_price = prices[symbol];
            const pnl = (current_price - price_per_share) * quantity;

            // Update the PnL in the database
            await pool.query('UPDATE trade SET pnl = ? WHERE trade_id = ?', [pnl, trade_id]);

            // Update the trade object for the response
            trade.pnl = pnl;
        }

        // Step 5: Send updated trades back to the client
        res.status(200).json(trades);
    } catch (err) {
        console.error('Database or processing error:', err);
        res.status(500).send('Failed to retrieve and update trades.');
    }
};


module.exports = { getTradesByUser };
