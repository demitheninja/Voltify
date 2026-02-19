export default async function handler(req, res) {
  // Set CORS headers to allow your site to use it
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Voltify Proxy</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #0B1020; color: #EAF0FF; }
          input { padding: 10px; width: 300px; font-size: 16px; background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.2); color: white; }
          button { padding: 10px 20px; font-size: 16px; background: #7C3AED; color: white; border: none; cursor: pointer; }
        </style>
      </body>
      </html>
    `);
  }

  // Add https:// if missing
  let finalUrl = targetUrl;
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'https://' + finalUrl;
  }

  try {
    // Make it look like a real browser
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    // Get the response
    const text = await response.text();
    
    // Fix any relative links in the page
    const baseUrl = new URL(finalUrl).origin;
    const fixedText = text.replace(/(href|src)="\//g, `$1="${baseUrl}/`);
    
    // Send it back
    res.status(response.status).send(fixedText);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}