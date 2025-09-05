import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
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

  console.log(JSON.stringify({ tickers: data }, null, 2));
  await browser.close();
})();
