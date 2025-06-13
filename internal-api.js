const express = require('express');
const app = express();

const secret_token = 'internal-access';

function authenticateInteral(req, res, next) {
    const internalHeader = req.headers['x-internal-auth'];

    if(internalHeader !== secret_token) {
        return res.status(403).send('Forbidden: Internal use only');
    }

    next();
};

app.get('/', (req, res) => {
    res.send(`
      <html>
        <head><title>Internal API Token Input</title></head>
        <body>
          <h1>Enter Internal Token to Access Server Stats</h1>
          <input type="text" id="token" placeholder="Enter your internal token" style="width: 300px;"/>
          <button id="fetch-btn">Fetch Server Stats</button>
          <pre id="result" style="white-space: pre-wrap; border: 1px solid #ccc; padding: 10px; margin-top: 10px;"></pre>
  
          <script>
            document.getElementById('fetch-btn').addEventListener('click', () => {
              const token = document.getElementById('token').value.trim();
  
              fetch('/api/internal/stats', {
                headers: {
                  'x-internal-auth': token
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
  
app.get('/api/internal/stats', authenticateInteral, (req, res) => {
    res.send({ serverLoad: '23%', uptime: '12 days' });
});

app.listen(4003, () => console.log('✅ Internal API running on port 4003'));
