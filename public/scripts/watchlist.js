document.addEventListener('DOMContentLoaded', () => {
    const stockList = document.getElementById('stock-list');
    const chartContainer = document.getElementById('chart-container');
    const performanceDetails = document.getElementById('performance-details');

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
        li.addEventListener('click', () => loadStockDetails(stock)); // Add click event
        stockList.appendChild(li);
    });

    // Load stock details
    const loadStockDetails = async (symbol) => {
        try {
            const response = await fetch(`/api/stocks/stock/${symbol}`);
            const data = await response.json();

            // Update the chart
            updateChart(data.prices, symbol);

            // Update performance details
            performanceDetails.textContent = `The stock ${symbol} has changed by ${data.performance}% in the past two weeks.`;
        } catch (error) {
            console.error('Error loading stock details:', error);
            performanceDetails.textContent = 'Failed to load stock data.';
        }
    };

    // Update chart using Chart.js
    let chartInstance; // To manage chart updates
    const updateChart = (prices, stockSymbol) => {
        const labels = prices.map((price) => price.date).reverse();
        const data = prices.map((price) => price.close).reverse();

        // Clear previous chart
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
                        label: `${stockSymbol} Stock Price`,
                        data,
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                    },
                ],
            },
        });
    };
});
