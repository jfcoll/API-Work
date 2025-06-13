const express = require('express');
const app = express();

// Dummy token for partner
const PARTNER_TOKEN = 'secret-token-123';

// Serve the simple frontend at root "/"
app.get('/', (req, res) => {
    res.send(`
      <html>
        <head><title>Partner API Token Input</title></head>
        <body>
          <h1>Enter Partner Token to Access Data</h1>
          <input type="text" id="token" placeholder="Enter your partner token" style="width: 300px;"/>
          <button id="fetch-btn">Fetch Partner Data</button>
          <pre id="result" style="white-space: pre-wrap; border: 1px solid #ccc; padding: 10px; margin-top: 10px;"></pre>
  
          <script>
            document.getElementById('fetch-btn').addEventListener('click', () => {
              const token = document.getElementById('token').value.trim();
  
              fetch('/api/partner/data', {
                headers: {
                  'x-api-key': token
                }
              })
              .then(res => {
                if (!res.ok) throw new Error('HTTP ' + res.status + ' - ' + res.statusText);
                return res.json();
              })
              .then(data => {
                document.getElementById('result').textContent = JSON.stringify(data, null, 2);
              })
              .catch(err => {
                document.getElementById('result').textContent = 'Error: ' + err.message;
              });
            });
          </script>
        </body>
      </html>
    `);
  });

// Define a GET endpoint at /api/partner/data
app.get('/api/partner/data', (req, res) => {
    // Extract the API key token sent in the request headers (x-api-key)
    const token = req.headers['x-api-key'];

    if (token !== PARTNER_TOKEN) {
        return res.status(403).send('Forbidden: Invalid partner token');
    }

    res.send({ data: 'Very exclusive partner content' });
    });

app.listen(4002, () => console.log('✅ Partner API running on port 4002'));
