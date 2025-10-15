const mongoose = require('mongoose');

async function connectDB(uri, options = {}) {
  if (!uri) throw new Error('MONGODB_URI is required');
  const defaultOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, Object.assign(defaultOptions, options));
  return mongoose;
}

module.exports = { connectDB };
