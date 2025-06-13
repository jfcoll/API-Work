const express = require('express');
const app = express();

app.get('/api/public/courses', (req, res) => {
  res.send([
    { id: 1, name: 'Public Course 1' },
    { id: 2, name: 'Public Course 2' }
  ]);
});

app.listen(4001, () => console.log('✅ Public API running on port 4001'));
