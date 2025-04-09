const { getParcel } = require('../services/redis_service');
const ParcelArchive = require('../models/parcel_archive');

async function archiveParcelById(parcelId) {
  const parcel = await getParcel(parcelId);

  if (!parcel) {
    console.warn(`[ARCHIVE] Parcel ${parcelId} not found in Redis`);
    return;
  }

  const archive = new ParcelArchive({
    parcelId,
    currentStatus: parcel.currentStatus,
    statusHistory: parcel.history || []
  });

  await archive.save();
  console.log(`[ARCHIVED] Parcel ${parcelId} saved to Mongo`);
}

module.exports = { archiveParcelById };
