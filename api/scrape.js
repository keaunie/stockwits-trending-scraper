import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  try {
    const executablePath = await chromium.executablePath();

    if (!executablePath) {
      throw new Error('Chromium executable not found');
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath,
      headless: chromium.headless,
      defaultViewport: chromium.defaultViewport
    });

    const page = await browser.newPage();
    await page.goto('https://stocktwits.com/sentiment/trending', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
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
    res.status(500).json({
      error: 'Scraper failed',
      details: error.message
    });
  }
}
