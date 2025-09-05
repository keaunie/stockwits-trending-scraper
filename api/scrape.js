import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://stocktwits.com/sentiment/trending', {
      waitUntil: 'networkidle2'
    });

    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('table tr'));
      return rows.slice(1).map(row => {
        const cells = row.querySelectorAll('td');
        return {
          symbol: cells[1]?.innerText.trim(),
          change: cells[2]?.innerText.trim(),
          volume: cells[3]?.innerText.trim()
        };
      });
    });

    await browser.close();
    res.status(200).json({ tickers: data });
  } catch (error) {
    res.status(500).json({ error: 'Scraper failed', details: error.message });
  }
}
