const http = require("http");
const { Server } = require("socket.io");
const app = require("./index");
const { connectRedis } = require("./services/redis_service");
const { connectMongo } = require("./services/mongo_service");
const { setupSocketIO } = require("./sockets/socket_manager");

let server;

async function startServer(port = process.env.PORT || 3000) {
  await connectRedis();
  await connectMongo();

  server = http.createServer(app);
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

module.exports = { startServer };
