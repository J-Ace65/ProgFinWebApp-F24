 const axios = require('axios');

//api key
const API_KEY = 'RO78EDLKGG4CBMAC'

// Fetch stock details (price data, performance)
const getStockDetails = async (req, res) => {
     const userId = req.session.userId;

    const { symbol } = req.params;

    if (!symbol || typeof symbol !== 'string') {
        return res.status(400).json({ error: 'Invalid symbol provided.' });
    }

    try {
        const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`
       
        );

        // console.log('API Response:', response.data);

        const data = response.data['Time Series (60min)'];
        if (!data) {
            return res.status(404).json({ error: 'Stock data not found.' });
        }
        // Past 2 weeks
        const times = Object.keys(data).slice(0, 12); 
        const prices = times.map((time) => ({
            time,
            close: parseFloat(data[time]['4. close']),
        }));

        // Calculate performance
        const performance = (
            ((prices[0].close - prices[prices.length - 1].close) /
                prices[prices.length - 1].close) *
            100
        ).toFixed(2);

        res.json({ prices, performance, userId });
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        res.status(500).json({ error: 'Failed to fetch stock data.' });
    }
};

module.exports = {
    getStockDetails,
};
