# Stocktwits Trending Scraper

This Vercel serverless function uses Puppeteer to scrape trending tickers from Stocktwits.

## Deploy

1. Clone this repo
2. Push to GitHub
3. Import to Vercel
4. Your endpoint will be: `https://your-vercel-project.vercel.app/api/scrape`

## Output

```json
{
  "tickers": [
    { "symbol": "NEON", "change": "+31.12%", "volume": "High" },
    ...
  ]
}

---

## 🧪 Final Notes

- Make sure your repo has this exact structure.
- Vercel will treat `api/scrape.js` as a serverless function.
- The `.js` extension should not be included in the URL when calling the endpoint.
- You can test the endpoint in n8n using an HTTP Request node.

---
