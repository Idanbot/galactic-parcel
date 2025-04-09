const http = require("http");
const { Server } = require("socket.io");
const cron = require("node-cron");
const app = require("./index");
const { connectRedis } = require("./services/redis_service");
const { connectMongo } = require("./services/mongo_service");
const { setupSocketIO } = require("./sockets/socket_manager");
const { runArchiveSweep } = require("./jobs/archive_cron");

async function startServer(port = process.env.PORT || 3000) {
  await connectRedis();
  await connectMongo();

  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });

  setupSocketIO(io);
  app.set("io", io);

  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
      resolve();
    });
  });
}

// Auto-start when run directly (not during tests)
if (require.main === module) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

cron.schedule("*/5 * * * * *", () => { // short cron only for dev/test, for prod 1hr would be better
  runArchiveSweep().catch((err) => console.error("Cron error:", err));
});

module.exports = { startServer };
