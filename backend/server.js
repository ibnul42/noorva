// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
