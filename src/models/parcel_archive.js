const mongoose = require('mongoose');

const parcelArchiveSchema = new mongoose.Schema({
  parcelId: { type: String, required: true },
  statusHistory: [
    {
      status: String,
      timestamp: { type: Date, default: Date.now },
    }
  ],
});

module.exports = mongoose.model('ParcelArchive', parcelArchiveSchema);
