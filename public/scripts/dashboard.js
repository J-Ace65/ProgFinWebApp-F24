document.addEventListener('DOMContentLoaded', () => {
    async function fetchActiveStocks() {
        try {
            const response = await fetch('/api/stocks/active-stocks'); // API endpoint
            const data = await response.json();

            if (response.ok) {
                const stocksOwnedElement = document.getElementById('stocks-owned');
                if (stocksOwnedElement) {
                    stocksOwnedElement.textContent = `Stocks Owned: ${data.activeStocks}`;
                } else {
                    console.error('Element with id "stocks-owned" not found');
                }
            } else {
                console.error(data.error);
                document.getElementById('stocks-owned').textContent = 'Stocks Owned: Error';
            }
        } catch (error) {
            console.error(error);
            const stocksOwnedElement = document.getElementById('stocks-owned');
            if (stocksOwnedElement) {
                stocksOwnedElement.textContent = 'Stocks Owned: Error';
            }
        }
    }

    async function fetchTotalPnl() {
        try {
            const response = await fetch('/api/stocks/total-pnl'); // API endpoint for PnL
            const data = await response.json();
    
            if (response.ok) {
                const pnlElement = document.getElementById('total-pnl');
                if (pnlElement) {
                    // Ensure totalPnl is a valid number before calling toFixed
                    const totalPnl = Number(data.totalPnl) || 0; // Default to 0 if invalid
                    pnlElement.textContent = `Total PnL: ${totalPnl.toFixed(2)}%`;
                } else {
                    console.error('Element with id "total-pnl" not found');
                }
            } else {
                console.error(data.error);
                document.getElementById('total-pnl').textContent = 'Total PnL: Error';
            }
        } catch (error) {
            console.error(error);
            const pnlElement = document.getElementById('total-pnl');
            if (pnlElement) {
                pnlElement.textContent = 'Total PnL: Error';
            }
        }
    }
    

    // Call the functions when the DOM is fully loaded
    fetchActiveStocks();
    fetchTotalPnl();
});
