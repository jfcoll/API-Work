const express = require('express');
const axios = require('axios');
const app = express();

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Composite Data Viewer</title>
</head>
<body>
  <h1>Retrieve Composite Data</h1>
  <label for="token">Partner Token (optional):</label>
  <input type="text" id="token" placeholder="Enter partner token" style="width: 300px;">
  <button onclick="fetchData()">Fetch Composite Data</button>
  <pre id="result" style="margin-top: 20px; border: 1px solid #ccc; padding: 10px;"></pre>

  <script>
    function fetchData() {
      const token = document.getElementById('token').value.trim();
      fetch('/api/composite-data', {
        headers: {
          'x-api-key': token
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => {
        document.getElementById('result').textContent = JSON.stringify(data, null, 2);
      })
      .catch(err => {
        document.getElementById('result').textContent = 'Error: ' + err.message;
      });
    }
  </script>
</body>
</html>
  `);
});

app.get('/api/composite-data', async (req, res) => {
  try {
    const token = req.headers['x-api-key'];
    const compositeResult = {};

    const publicResponse = await axios.get('http://localhost:4001/api/public/courses');
    compositeResult.courses = publicResponse.data;

    try {
      const partnerResponse = await axios.get('http://localhost:4002/api/partner/data', {
        headers: {
          'x-api-key': token || ''
        }
      });
      compositeResult.partners = partnerResponse.data;
    } catch (err) {

      compositeResult.partners = 'Access denied or no token provided';
    }

    res.json(compositeResult);
  } catch (err) {
    console.error('Error fetching composite data:', err.message);
    res.status(500).send('Failed to fetch composite data');
  }
});

const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`🚀 Composite API running at http://localhost:${port}`));
