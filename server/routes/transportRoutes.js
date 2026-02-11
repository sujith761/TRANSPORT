const express = require('express');
const router = express.Router();
const {
  applyTransport,
  changeRoute,
  cancelRoute,
  getApplicationStatus,
  getNotifications,
  markNotificationRead
} = require('../controllers/transportController');
const { protect } = require('../middleware/auth');
const { validateTransportApplication } = require('../middleware/validation');

router.post('/apply', protect, validateTransportApplication, applyTransport);
router.post('/change', protect, validateTransportApplication, changeRoute);
router.post('/cancel', protect, validateTransportApplication, cancelRoute);
router.get('/status', protect, getApplicationStatus);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

module.exports = router;
