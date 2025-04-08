const express = require('express');
const router = express.Router();
const {
  createParcel,
  updateParcelStatus,
  getParcelStatus,
  getParcelHistory,
  archiveParcel,
} = require('../controllers/parcel_controller');

router.post('/', createParcel);
router.patch('/:id/status', updateParcelStatus);
router.get('/:id', getParcelStatus);
router.get('/:id/history', getParcelHistory);
router.post('/:id/archive', archiveParcel);

module.exports = router;
