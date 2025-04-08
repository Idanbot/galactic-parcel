const {
  setParcel,
  getParcel,
  deleteParcel,
} = require("../services/redis_service");
const ParcelArchive = require("../models/parcel_archive");
const { VALID_STATUSES } = require("../utils/status_enums");

const DEFAULT_TTL = 86400; // 24 hours in seconds

exports.createParcel = async (req, res) => {
  const { parcelId, status, ttl } = req.body;

  if (!parcelId || !status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid parcel data" });
  }

  const parcel = {
    parcelId,
    history: [{ status, timestamp: new Date() }],
    currentStatus: status,
  };

  const existing = await getParcel(parcelId);
  if (existing) {
    return res
      .status(409)
      .json({ error: "Parcel with this ID already exists" });
  }

  await setParcel(parcelId, parcel, ttl || DEFAULT_TTL);
  return res.status(201).json({ message: "Parcel created", parcel });
};

exports.updateParcelStatus = async (req, res) => {
  const { id } = req.params;
  const { status, ttl } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const parcel = await getParcel(id);
  if (!parcel) {
    return res.status(404).json({ error: "Parcel not found" });
  }

  parcel.history.push({ status, timestamp: new Date() });
  parcel.currentStatus = status;

  await setParcel(id, parcel, ttl || DEFAULT_TTL);

  if (status === "Lost in Space") {
    console.warn(`[ALERT] Parcel ${id} is LOST IN SPACE.`);
  }

  const io = req.app.get("io");
  io.to(id).emit("parcel:update", {
    parcelId: id,
    status,
    timestamp: new Date(),
  });

  return res.json({ message: "Status updated", parcel });
};

exports.getParcelStatus = async (req, res) => {
  const { id } = req.params;
  const parcel = await getParcel(id);
  if (!parcel) {
    return res.status(404).json({ error: "Parcel not found" });
  }

  return res.json({ status: parcel.currentStatus });
};

exports.getParcelHistory = async (req, res) => {
  const { id } = req.params;

  const parcel = await getParcel(id);
  if (parcel) {
    return res.json({
      parcelId: parcel.parcelId,
      history: parcel.statusHistory,
    });
  }

  const archive = await ParcelArchive.findOne({ parcelId: id });
  if (!archive) {
    return res.status(404).json({ error: "No archive found for this parcel" });
  }

  return res.json({
    parcelId: archive.parcelId,
    history: archive.statusHistory,
  });
};

exports.archiveParcel = async (req, res) => {
  const { id } = req.params;

  const parcel = await getParcel(id);
  if (!parcel) {
    return res
      .status(404)
      .json({ error: "Parcel not found in Redis (possibly already expired)" });
  }

  const archived = new ParcelArchive({
    parcelId: parcel.parcelId,
    statusHistory: parcel.history,
  });

  await archived.save();
  await deleteParcel(id);

  return res.json({ message: `Parcel ${id} archived to MongoDB` });
};
