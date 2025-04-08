const request = require("supertest");
const { startServer } = require("../src/server");
const { redis } = require("../src/services/redis_service");
const mongoose = require("mongoose");
const ioClient = require("socket.io-client");

const BASE_URL = "/parcels";
const TEST_PORT = 4040;
const TEST_URL = `http://localhost:${TEST_PORT}`;
let socket;

beforeAll(async () => {
  await startServer(TEST_PORT); // Mongo connection happens here
});

beforeEach(async () => {
  await redis.flushAll();
});

afterAll(async () => {
  if (socket?.connected) socket.disconnect();
  await mongoose.disconnect();
  await redis.quit();
});

test("WebSocket client receives parcel:update event", (done) => {
  const parcelId = "TEST-SOCKET";

  socket = ioClient(TEST_URL);

  socket.on("connect", () => {
    socket.emit("joinParcelRoom", parcelId);

    socket.on("parcel:update", (data) => {
      try {
        expect(data.parcelId).toBe(parcelId);
        expect(data.status).toBe("In Transit");
        done();
      } catch (err) {
        done(err);
      }
    });

    request(TEST_URL)
      .post(`${BASE_URL}`)
      .send({ parcelId, status: "Preparing" })
      .then(() => {
        return request(TEST_URL)
          .patch(`${BASE_URL}/${parcelId}/status`)
          .send({ status: "In Transit" });
      })
      .catch((err) => done(err));
  });

  socket.on("connect_error", (err) => {
    done(err);
  });
}, 20000);
