// Fetch active stocks dynamically
async function fetchActiveStocks() {
    try {
        const response = await fetch('/api/stocks/active-stocks'); // API endpoint
        const data = await response.json();

        if (response.ok) {
            document.getElementById('stocks-owned').textContent = `Stocks Owned: ${data.activeStocks}`;
        } else {
            console.error(data.error);
            document.getElementById('stocks-owned').textContent = 'Stocks Owned: Error';
        }
    } catch (error) {
        console.error(error);
        document.getElementById('stocks-owned').textContent = 'Stocks Owned: Error';
    }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', fetchActiveStocks);
