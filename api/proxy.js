export default async function handler(req, res) {
  const targetUrl = req.query.url;
  
  if (!targetUrl) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Proxy</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; }
          input { padding: 10px; width: 300px; font-size: 16px; }
          button { padding: 10px 20px; font-size: 16px; }
        </style>
      </head>
      <body>
        <h2>🔒 Website Proxy</h2>
        <p>Enter any URL to visit through the proxy:</p>
        <input id="url" placeholder="example: google.com">
        <button onclick="go()">Go</button>
        <script>
          function go() {
            const url = document.getElementById('url').value;
            window.location.href = '/api/proxy?url=' + encodeURIComponent(url);
          }
        </script>
      </body>
      </html>
    `);
  }

  let finalUrl = targetUrl;
  if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
    finalUrl = 'https://' + finalUrl;
  }

  try {
    const response = await fetch(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}