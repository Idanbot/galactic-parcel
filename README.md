# 🌌 Galactic Parcel Tracking System

A backend system for Intergalactic Parcel Services (IPS), built with **Node.js**, **Redis**, and **MongoDB**. This service tracks space parcels in real-time, handles status updates, logs alerts for lost parcels, and archives history for analysis.

---

## 🚀 Features

- Track active parcel statuses in Redis with TTL support  
- Archive expired parcels to MongoDB  
- Trigger console alerts for "Lost in Space" parcels  
- Real-time parcel status updates via WebSocket (Socket.IO)  
- RESTful API with CRUD operations  
- Fully tested using Jest (REST + WebSocket coverage)

---

## 🛠 Tech Stack

- **Node.js + Express**
- **Redis** (for active tracking with TTL)
- **MongoDB** (for archive storage)
- **Docker Compose** (for local development)
- **Jest + Supertest + Socket.IO client** (for testing)

---

## 📦 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/yourusername/galactic-parcel-tracker.git
cd galactic-parcel-tracker
npm install
```

### 2. Start Redis & MongoDB with Docker

```bash
docker-compose up --build
```

> Rebuilds the app image and spins up Redis + MongoDB containers.

---

## 🧪 Run Tests

```bash
npm test
```

> Includes both REST API tests and real-time WebSocket tests (via socket.io-client and Supertest).

---

## ⚙️ Useful Docker Commands

### Stop and Clean Containers, Volumes, and Networks

```bash
docker-compose down --volumes --remove-orphans
```

---

## 🧭 Redis Commands (Inside Container)

### Enter Redis CLI

```bash
docker exec -it redis redis-cli
```

### View All Parcel Keys

```bash
keys PARCEL:*
```

### View a Specific Parcel Entry

```bash
get PARCEL:TEST123
```

### Check TTL on Parcel

```bash
ttl PARCEL:TEST123
```

---

## 🗃 MongoDB Commands (Inside Container)

### Enter MongoDB Shell

```bash
docker exec -it mongodb mongosh
```

### Use the Correct Database

```js
use galactic
```

### View All Archived Parcels

```js
db.parcelarchives.find().pretty()
```

### Remove a Specific Archive

```js
db.parcelarchives.deleteOne({ parcelId: "TEST123" })
```

---

## 🔐 Environment Variables

Create a `.env` file based on the provided `.env.example`:

```env
PORT=3000
REDIS_URL=redis://redis:6379
MONGO_URL=mongodb://mongo:27017/galactic
```

---

## 📬 API Endpoints

| Method | Route                        | Description                      |
|--------|------------------------------|----------------------------------|
| POST   | `/parcels`                   | Create a new parcel              |
| PATCH  | `/parcels/:id/status`        | Update parcel status             |
| GET    | `/parcels/:id`               | Get latest status                |
| GET    | `/parcels/:id/history`       | Retrieve archived parcel history |
| POST   | `/parcels/:id/archive`       | Manually archive parcel (mock)   |

---

## 🧲 WebSocket Usage

The backend supports real-time status updates using **Socket.IO**.  
Each client can join a room for a specific `parcelId` and receive updates when its status changes.

### Connect and Subscribe

```js
const socket = io('http://localhost:3000');
socket.emit('joinParcelRoom', 'TEST123');

socket.on('parcel:update', (data) => {
  console.log('Update:', data);
});
```

> Only status updates for the subscribed parcel ID will be received.

---

## 💡 Tips

- Use `ttl` in the POST body to simulate short-lived parcels (e.g., `ttl: 120` for 2 min).
- Use the archive endpoint to simulate expiry + Mongo storage.