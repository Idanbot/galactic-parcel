const express = require('express');
const router = express.Router();
const {
  createParcel,
  updateParcelStatus,
  getParcelStatus,
  getParcelHistory,
  archiveParcel,
} = require('../controllers/parcel_controller');

router.get('/:id', getParcelStatus);
router.get('/:id/history', getParcelHistory);
router.post('/', createParcel);
router.post('/:id/archive', archiveParcel);
router.patch('/:id/status', updateParcelStatus);


module.exports = router;
