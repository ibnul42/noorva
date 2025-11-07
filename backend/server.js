// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// Allow CORS and credentials so that frontend (on another origin) can receive HttpOnly cookies
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// cookie parser for auth
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes
const usersRouter = require('./routes/users');
const superUsersRouter = require('./routes/superUsers');
app.use('/api/users', usersRouter);
app.use('/api/users', superUsersRouter);
const { connectDB } = require('./helper/db');

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in environment; aborting');
    process.exit(1);
  }
  try {
    await connectDB(uri);
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

start();
