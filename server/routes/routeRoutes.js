const express = require('express');
const router = express.Router();
const {
  getRoutes,
  getRoute,
  searchRoutes,
  getRouteDetails
} = require('../controllers/routeController');

router.get('/', getRoutes);
router.get('/search', searchRoutes);
router.get('/:id', getRoute);
router.get('/:id/details', getRouteDetails);

module.exports = router;
