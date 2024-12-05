document.addEventListener('DOMContentLoaded', () => {
    const stockList = document.getElementById('stock-list');
    const chartContainer = document.getElementById('chart-container');
    const performanceDetails = document.getElementById('performance-details');
    const buyButton = document.getElementById('buy-button');
    const sellButton = document.getElementById('sell-button');

    let currentStock = null; 
    let currentPrice = null; 

    // Load stock details when a stock is clicked
    const loadStockDetails = async (symbol) => {
        try {
            const response = await fetch(`/api/stocks/stock/${symbol}`);
            const data = await response.json();

            currentStock = symbol;
            currentPrice = data.prices.at(-1).close;
            const sma30 = calculateSMA(data.prices, 30);

            // Calculate Buy/Sell Signals
            const signals = calculateSignals(data.prices, sma30);

            // Update chart and performance
            updateChart(data.prices, symbol, sma30, signals);

            const lastSignal = signals[signals.length - 1];
            performanceDetails.textContent = `The stock ${symbol} has changed by ${data.performance}% in the past 12 hours.`;
        } catch (error) {
            console.error('Error loading stock details:', error);
            performanceDetails.textContent = 'Failed to load stock data.';
        }
    };

    const calculateSMA = (prices, period) => {
        const sma = [];
        for (let i = 0; i < prices.length; i++) {
            const slice = prices.slice(Math.max(0, i - period + 1), i + 1);
            const avg = slice.reduce((sum, price) => sum + price.close, 0) / slice.length;
            sma.push({ time: prices[i].time, value: avg });
        }
        return sma;
    };
    
    
    

      // Calculate Buy/Sell Signals
      const calculateSignals = (prices, sma30) => {
        const signals = [];
    
        for (let i = 1; i < prices.length; i++) {
            if (sma30[i]?.value !== null) { // Check SMA value exists
                // Buy Signal: Price crosses above SMA
                if (prices[i].close > sma30[i].value && prices[i - 1].close <= sma30[i - 1]?.value) {
                    signals.push({ time: prices[i].time, action: 'Buy', price: prices[i].close });
                }
                // Sell Signal: Price crosses below SMA
                else if (prices[i].close < sma30[i].value && prices[i - 1].close >= sma30[i - 1]?.value) {
                    signals.push({ time: prices[i].time, action: 'Sell', price: prices[i].close });
                }
            }
        }
    
        return signals;
    };

    // Chart.js integration for stock prices
    let chartInstance;
    const updateChart = (prices, stockSymbol, sma30, signals) => {
        const labels = prices.map((price) => price.time).reverse();
        const data = prices.map((price) => price.close).reverse();
        const smaValues = sma30.map((sma) => (sma ? sma.value : null)).reverse();

        const buySignals = signals.filter((s) => s.action === 'Buy');
        const sellSignals = signals.filter((s) => s.action === 'Sell');

        chartContainer.innerHTML = '<canvas id="stock-chart"></canvas>';
        const ctx = document.getElementById('stock-chart').getContext('2d');

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Buy Signals',
                        data: buySignals.map((s) => ({ x: s.time, y: s.price })),
                        backgroundColor: 'green',
                        pointBorderColor: 'green',
                        pointStyle: 'triangle',
                        pointRadius: 6,
                        borderWidth: 2,
                        showLine: false,
                    },
                    {
                        label: 'Sell Signals',
                        data: sellSignals.map((s) => ({ x: s.time, y: s.price })),
                        backgroundColor: 'red',
                        pointBorderColor: 'red',
                        pointStyle: 'triangle',
                        pointRadius: 6,
                        borderWidth: 2,
                        showLine: false,
                    },
                    {
                        label: `${stockSymbol} Stock Price`,
                        data,
                        borderColor: 'purple',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                    {
                        label: 'SMA',
                        data: smaValues,
                        borderColor: 'blue',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false,
                    }
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });
    };

    // Handle "BUY" button click
    buyButton.addEventListener('click', async () => {
        if (!currentStock || !currentPrice) {
            alert('Please select a stock first!');
            return;
        }

        const quantity = parseInt(prompt("Enter the quantity you want to trade:")); // Example quantity
        const totalPrice = currentPrice * quantity;

        const tradeData = {
            user_id: 1, // Replace with dynamic user ID
            symbol: currentStock,
            price_per_share: currentPrice,
            quantity,
            total_price: totalPrice,
            buy_time: new Date().toISOString().slice(0, 19).replace('T', ' '), // MySQL-compatible datetime
            trade_count: 1, // Increment logic if needed
        };

        try {
            const response = await fetch('/api/trade/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tradeData),
            });

            if (response.ok) {
                alert(`Successfully bought ${quantity} shares of ${currentStock} at $${currentPrice}!`);
            } else {
                const error = await response.json();
                alert(`Failed to save trade: ${error.message}`);
            }
        } catch (error) {
            console.error('Error saving trade:', error);
            alert('An unexpected error occurred.');
        }
    });

    // Add stock list dynamically (if needed)
    const stocks = [
        'AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'NVDA', 'META', 'NFLX', 'DIS',
        'BABA', 'INTC', 'AMD', 'ORCL', 'CRM', 'PYPL', 'SQ', 'UBER', 'SHOP',
        'ZM', 'TWTR',
    ]; // Add more stocks
    stocks.forEach((stock) => {
        const li = document.createElement('li');
        li.textContent = stock;
        li.className = 'bg-gray-700 hover:bg-gray-600 p-3 rounded cursor-pointer';
        li.addEventListener('click', () => loadStockDetails(stock));
        stockList.appendChild(li);
    });
});
