const puppeteer = require('puppeteer');

const getStockHistory = async (symbol) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Safer launch options
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const url = `https://finance.yahoo.com/quote/${symbol}/history?period1=${Math.floor(
      startDate.getTime() / 1000
    )}&period2=${Math.floor(endDate.getTime() / 1000)}&interval=1wk&p=${symbol}`;

    await page.goto(url, { waitUntil: 'networkidle2' });

    const stockData = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tbody tr');
      const data = [];
      rows.forEach((row) => {
        const columns = row.querySelectorAll('td');
        if (columns.length >= 5) {
          const date = columns[0]?.innerText || null;
          const close = columns[4]?.innerText.replace(/,/g, '') || null;
          if (date && close && !isNaN(parseFloat(close))) {
            data.unshift({ date, close: parseFloat(close) });
          }
        }
      });
      return data;
    });

    await browser.close();

    if (stockData.length === 0) {
      throw new Error('No valid stock data found');
    }

    return stockData;
  } catch (error) {
    console.error('Error in fetchStockData:', error.message);
    throw error;
  }
};

module.exports = { getStockHistory };


// const puppeteer = require('puppeteer');

// const getStockHistory = async (req, res) => {
//   const { symbol } = req.params;

//   if (!symbol) {
//     return res.status(400).json({ error: 'Stock symbol is required' });
//   }

//   try {
//     console.log(`Fetching stock history for: ${symbol}`);
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'], // Safer Puppeteer launch options
//     });

//     const page = await browser.newPage();
//     await page.setUserAgent(
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//     );

//     const endDate = new Date();
//     const startDate = new Date();
//     startDate.setFullYear(endDate.getFullYear() - 1);

//     const period1 = Math.floor(startDate.getTime() / 1000);
//     const period2 = Math.floor(endDate.getTime() / 1000);

//     const url = `https://finance.yahoo.com/quote/${symbol}/history?period1=${period1}&period2=${period2}&interval=1wk&p=${symbol}`;
//     console.log(`Navigating to URL: ${url}`);

//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Extract data
//     const stockData = await page.evaluate(() => {
//       const rows = document.querySelectorAll('table tbody tr');
//       const data = [];
//       rows.forEach((row) => {
//         const columns = row.querySelectorAll('td');
//         if (columns.length >= 5) {
//           const date = columns[0]?.innerText || null;
//           const close = columns[4]?.innerText.replace(/,/g, '') || null;
//           if (date && close && !isNaN(parseFloat(close))) {
//             data.unshift({ date, close: parseFloat(close) });
//           }
//         }
//       });
//       return data;
//     });

//     await browser.close();

//     if (stockData.length === 0) {
//       console.warn(`No valid data found for symbol: ${symbol}`);
//       return res.status(404).json({ error: 'No stock data found' });
//     }

//     console.log(`Fetched data for ${symbol}:`, stockData.slice(0, 5)); // Log first 5 entries for brevity
//     res.status(200).json(stockData);
//   } catch (error) {
//     console.error('Error in getStockHistory:', error.message);
//     res.status(500).json({ error: 'Failed to fetch stock history' });
//   }
// };

// module.exports = { getStockHistory };
