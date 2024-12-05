document.addEventListener('DOMContentLoaded', () => {
    const stockList = document.getElementById('stock-list');
    const chartContainer = document.getElementById('chart-container');
    const stockStats = document.getElementById('stockStats');
    const performanceMetrics = document.getElementById('performanceMetrics');

    // List of stocks
    const stocks = [
        'AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA', 'NVDA', 'META', 'NFLX', 'DIS',
        'BABA', 'INTC', 'AMD', 'ORCL', 'CRM', 'PYPL', 'SQ', 'UBER', 'SHOP',
        'ZM', 'TWTR',
    ];

    // Dynamically generate stock list
    stocks.forEach((stock) => {
        const li = document.createElement('li');
        li.textContent = stock;
        li.className = 'bg-gray-700 hover:bg-gray-600 p-3 rounded cursor-pointer';
        li.addEventListener('click', () => loadStockHistory(stock));
        stockList.appendChild(li);
    });

    // Load stock details
    const loadStockHistory = async (symbol) => {
        try {
            const response = await fetch(`/api/stocks/stockhistory/${symbol}`);
            const stockData = await response.json();

            // Prepare data for the chart
            const labels = stockData.map((data) => data.date);
            const closingPrices = stockData.map((data) => data.close);

            //  SMA-10
            const sma10 = calculateSMA(closingPrices, 10);

            // Buy Signals
            const buySignals = [];
            for (let i = 1; i < closingPrices.length - 1; i++) {
                if (
                    sma10[i] !== null &&             // Ensure SMA-10 is available
                    sma10[i] > closingPrices[i] &&  // SMA-10 is above the current price
                    sma10[i - 1] <= closingPrices[i - 1] // SMA-10 crosses above the price
                ) {
                    // Buy at the next closing price
                    buySignals.push({ x: labels[i + 1], y: closingPrices[i + 1] });
                }
            }
            

            // Update chart
            updateChart(labels, closingPrices, sma10, buySignals, symbol);

            // Update statistics
            const mean = (closingPrices.reduce((sum, price) => sum + price, 0) / closingPrices.length).toFixed(2);
            const max = Math.max(...closingPrices).toFixed(2);

            stockStats.innerHTML = `
                <h3 class="text-lg font-bold mb-2">Statistics</h3>
                <p>Mean: $${mean}</p>
                <p>Max: $${max}</p>
            `;

            // Update performance metrics
            updatePerformanceMetrics(closingPrices, sma10);
        } catch (error) {
            console.error('Error loading stock details:', error);
            stockStats.innerHTML = '<p class="text-red-500">Failed to load stock data.</p>';
            chartContainer.innerHTML = '<p class="text-gray-400">Error loading chart data.</p>';
        }
    };

    // Update chart using Chart.js
    let chartInstance;
    const updateChart = (labels, closingPrices, sma10, buySignals, symbol) => {
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
                        label: 'Buy Signal',
                        data: buySignals,
                        backgroundColor: 'rgba(255, 165, 0, 0.7)', 
                        pointRadius: 5,
                        type: 'scatter'
                    },
                    {
                        label: `${symbol} Closing Price`,
                        data: closingPrices,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: 'SMA-10',
                        data: sma10,
                        borderColor: 'rgba(192, 75, 75, 1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.1,
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Date', color: '#ffffff' },
                        ticks: { color: '#ffffff' },
                    },
                    y: {
                        title: { display: true, text: 'Price (USD)', color: '#ffffff' },
                        ticks: { color: '#ffffff' },
                    },
                },
            },
        });
    };

    // Calculate SMA
    const calculateSMA = (data, windowSize) => {
        const sma = [];
        for (let i = 0; i < data.length; i++) {
            if (i < windowSize - 1) {
                sma.push(null);
            } else {
                const windowData = data.slice(i - windowSize + 1, i + 1);
                const average = windowData.reduce((sum, val) => sum + val, 0) / windowSize;
                sma.push(average);
            }
        }
        return sma;
    };

    // Update performance metrics
    const updatePerformanceMetrics = (closingPrices, sma10) => {
        let totalProfit = 0;
        let maxDrawdown = 0;
        let peakBalance = initialBalance;
        let balance = initialBalance;

        const lotSize = 2; // Lot size
        const maxPositions = 5; 
        let activePositions = []; 

        for (let i = 1; i < closingPrices.length; i++) {
            // Buy signal: price crosses above SMA-10 and is rising
            if (
                sma10[i] !== null &&             
                sma10[i] > closingPrices[i] &&  
                sma10[i - 1] <= closingPrices[i - 1]
            ) {
                if (activePositions.length < maxPositions) {
                    const entryPrice = closingPrices[i];
                    activePositions.push(entryPrice);
                    balance -= entryPrice * lotSize;
                }
            }

            // Evaluate open positions
            if (activePositions.length > 0) {
                let closedProfit = 0;
                activePositions = activePositions.filter((entryPrice) => {
                    const positionProfit = (closingPrices[i] - entryPrice) * lotSize;
                    if (closingPrices[i] > entryPrice) {
                        closedProfit += positionProfit;
                        return false;
                    }
                    if (closingPrices[i]<entryPrice){
                        closedProfit-=positionProfit;
                        return false
                    }
                    return true;
                });
                totalProfit += closedProfit;
                balance += closedProfit;
            }

            // Update drawdown
            if (balance > peakBalance) peakBalance = balance;
            const drawdown = peakBalance - balance;
            if (drawdown > maxDrawdown) maxDrawdown = drawdown;
        }

        performanceMetrics.innerHTML = `
            <h3 class="text-lg font-bold mb-2">Performance Metrics</h3>
            <p>Total Profit: $${totalProfit.toFixed(2)}</p>
            
            <p>Overall Performance: ${(initialBalance+totalProfit).toFixed(2)}</p>
        `;
    };

    const initialBalance = 50000;
});
