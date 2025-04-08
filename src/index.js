require('dotenv').config();
const express = require('express');
const app = express();
const parcelRoutes = require('./routes/parcel_routes');

app.use(express.json());
app.use('/parcels', parcelRoutes);

module.exports = app;
