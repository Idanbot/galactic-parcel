require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const parcelRoutes = require('./routes/parcel_routes');

// Middlewares
app.use(helmet());           // Adds security headers
app.use(morgan('dev'));      // Logs each request
app.use(express.json());     // Parse JSON bodies

// Routes
app.use('/parcels', parcelRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

module.exports = app;
