const app = require('./index');
const { connectRedis } = require('./services/redis_service');
const { connectMongo } = require('./services/mongo_service');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectRedis();
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
