const axios = require('axios');

// Replace with your API key
const API_KEY = 'V496PEYJSCTIR7BJ';

// Fetch stock details (price data, performance)
const getStockDetails = async (req, res) => {
    const { symbol } = req.params;
    try {
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        );

        const data = response.data['Time Series (Daily)'];
        if (!data) {
            return res.status(404).json({ error: 'Stock data not found.' });
        }

        const dates = Object.keys(data).slice(0, 14); // Past 2 weeks
        const prices = dates.map((date) => ({
            date,
            close: parseFloat(data[date]['4. close']),
        }));

        // Calculate performance
        const performance = (
            ((prices[0].close - prices[prices.length - 1].close) /
                prices[prices.length - 1].close) *
            100
        ).toFixed(2);

        res.json({ prices, performance });
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock data.' });
    }
};

module.exports = {
    getStockDetails,
};
