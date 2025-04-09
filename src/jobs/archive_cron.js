const { redis } = require("../services/redis_service");
const { archiveParcelById } = require("../utils/archive_helper");

async function runArchiveSweep(thresholdSeconds = 10) { // short threshold for dev/test, in prod higher would be better
  const keys = await redis.keys("PARCEL:*");

  for (const key of keys) {
    const parcelId = key.split(":")[1];
    const ttl = await redis.ttl(key);

    if (ttl >= 0 && ttl <= thresholdSeconds) {
      console.log(
        `[ARCHIVE_CRON] Archiving soon-expiring parcel ${parcelId} (TTL: ${ttl}s)`
      );
      await archiveParcelById(parcelId);
    }
  }
}

module.exports = { runArchiveSweep };
