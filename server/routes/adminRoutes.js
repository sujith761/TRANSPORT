const express = require('express');
const router = express.Router();
const {
  getStudents,
  getApplications,
  approveApplication,
  rejectApplication,
  getAnalytics,
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  createBus,
  getBuses,
  updateBus,
  deleteBus,
  createRoute,
  updateRoute,
  deleteRoute,
  createMaintenance,
  getMaintenance,
  updateMaintenance,
  searchStudent
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// Students
router.get('/students', getStudents);
router.get('/students/search/:regNo', searchStudent);

// Applications
router.get('/applications', getApplications);
router.put('/applications/:id/approve', approveApplication);
router.put('/applications/:id/reject', rejectApplication);

// Analytics
router.get('/analytics', getAnalytics);

// Drivers
router.route('/drivers')
  .get(getDrivers)
  .post(createDriver);

router.route('/drivers/:id')
  .put(updateDriver)
  .delete(deleteDriver);

// Buses
router.route('/buses')
  .get(getBuses)
  .post(createBus);

router.route('/buses/:id')
  .put(updateBus)
  .delete(deleteBus);

// Routes
router.route('/routes')
  .post(createRoute);

router.route('/routes/:id')
  .put(updateRoute)
  .delete(deleteRoute);

// Maintenance
router.route('/maintenance')
  .get(getMaintenance)
  .post(createMaintenance);

router.route('/maintenance/:id')
  .put(updateMaintenance);

module.exports = router;
