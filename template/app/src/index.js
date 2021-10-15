const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Pulumi app listening at http://localhost:${port}`);
});
