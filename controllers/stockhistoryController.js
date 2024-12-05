const yahooFinance = require('yahoo-finance2').default;

const getStockHistory = async (symbol) => {
  try {
    if (!symbol) {
      throw new Error('Stock symbol is required');
    }
    // Fetch historical data for the past year with weekly intervals
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
    const stockData = historicalData.map((entry) => ({
      date: entry.date.toISOString().split('T')[0],
      close: entry.close,
    }));

    return stockData;
  } catch (error) {
    console.error('Error in fetchStockData:', error.message);
    throw error;
  }
};

module.exports = { getStockHistory };
