const yahooFinance = require('yahoo-finance2').default;

// Controller function for fetching stock history
const getStockHistoryController = async (req, res) => {
    const { symbol } = req.params;

    try {
        if (!symbol) {
            return res.status(400).json({ error: 'Stock symbol is required' });
        }

        // helper function to fetch historical data
        const stockHistory = await getStockHistory(symbol);

        res.status(200).json(stockHistory);
    } catch (error) {
        console.error('Error fetching stock history:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock data' });
    }
};

  // fetching historical stock data
const getStockHistory = async (symbol) => {
    try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);

        const options = {
            period1: startDate.toISOString().split('T')[0], // Start date
            period2: endDate.toISOString().split('T')[0],   // End date
            interval: '1wk',                                // Weekly data
        };

        // Fetch historical stock data
        const historicalData = await yahooFinance.historical(symbol, options);

        if (!historicalData || historicalData.length === 0) {
            throw new Error('No valid stock data found');
        }

        // Map and format the historical data
        return historicalData.map((entry) => ({
            date: entry.date.toISOString().split('T')[0],
            close: entry.close,
        }));
    } catch (error) {
        console.error('Error in getStockHistory:', error.message);
        throw error;
    }
};

module.exports = { getStockHistoryController };
