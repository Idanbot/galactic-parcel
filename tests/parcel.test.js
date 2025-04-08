const request = require('supertest');
const app = require('../src/index');
const { redis } = require('../src/services/redis_service');
const ParcelArchive = require('../src/models/parcel_archive');
const mongoose = require('mongoose');

const BASE_URL = '/parcels';

beforeAll(async () => {
  await redis.connect();
  await mongoose.connect('mongodb://localhost:27017/galactic_test');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await redis.quit();
});

describe('Parcel API Tests', () => {
  const testParcelId = 'TEST123';

  it('should create a parcel', async () => {
    const res = await request(app).post(BASE_URL).send({
      parcelId: testParcelId,
      status: 'Preparing',
      ttl: 120,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.parcel.parcelId).toBe(testParcelId);
  });

  it('should update parcel status', async () => {
    const res = await request(app).patch(`${BASE_URL}/${testParcelId}/status`).send({
      status: 'In Transit',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.parcel.currentStatus).toBe('In Transit');
  });

  it('should return current parcel status', async () => {
    const res = await request(app).get(`${BASE_URL}/${testParcelId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('In Transit');
  });

  it('should archive a parcel', async () => {
    const res = await request(app).post(`${BASE_URL}/${testParcelId}/archive`);
    expect(res.statusCode).toBe(200);
    const archive = await ParcelArchive.findOne({ parcelId: testParcelId });
    expect(archive).toBeTruthy();
    expect(archive.statusHistory.length).toBeGreaterThan(0);
  });

  it('should fail on unknown status', async () => {
    const res = await request(app).patch(`${BASE_URL}/BAD123/status`).send({
      status: 'Unknown',
    });
    expect(res.statusCode).toBe(400);
  });

  it('should return 404 for missing parcel', async () => {
    const res = await request(app).get(`${BASE_URL}/NONEXISTENT`);
    expect(res.statusCode).toBe(404);
  });
});
