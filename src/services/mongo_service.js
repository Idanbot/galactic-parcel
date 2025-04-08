const mongoose = require('mongoose');

async function connectMongo() {
  const uri = process.env.MONGO_URL || 'mongodb://localhost:27017/galactic';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB connected');
}

module.exports = { connectMongo };
