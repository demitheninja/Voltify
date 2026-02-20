exports.handler = async function(event, context) {
  const url = event.queryStringParameters.url;
  
  if (!url) {
    return {
      statusCode: 400,
      body: 'Missing url parameter'
    };
  }
  
  // Add https:// if missing
  let targetUrl = url;
  if (!targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl;
  }
  
  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const body = await response.text();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: body
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`
    };
  }
};