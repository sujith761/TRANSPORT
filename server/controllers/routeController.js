const Route = require('../models/Route');
const Bus = require('../models/Bus');

// @desc    Get all routes
// @route   GET /api/routes
// @access  Public
exports.getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find({ isActive: true }).sort('routeName');

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single route
// @route   GET /api/routes/:id
// @access  Public
exports.getRoute = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search routes
// @route   GET /api/routes/search
// @access  Public
exports.searchRoutes = async (req, res, next) => {
  try {
    const { busNumber, driverName } = req.query;
    let query = { isActive: true };

    if (busNumber || driverName) {
      // Find buses matching criteria
      let busQuery = {};
      if (busNumber) {
        busQuery.busNumber = new RegExp(busNumber, 'i');
      }

      const buses = await Bus.find(busQuery)
        .populate({
          path: 'driver',
          match: driverName ? { name: new RegExp(driverName, 'i') } : {}
        });

      const routeIds = buses
        .filter(bus => bus.driver || !driverName)
        .map(bus => bus.route);

      query._id = { $in: routeIds };
    }

    const routes = await Route.find(query);

    res.status(200).json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get route with bus details
// @route   GET /api/routes/:id/details
// @access  Public
exports.getRouteDetails = async (req, res, next) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    const bus = await Bus.findOne({ route: req.params.id })
      .populate('driver', 'name phone licenseNumber');

    res.status(200).json({
      success: true,
      data: {
        route,
        bus
      }
    });
  } catch (error) {
    next(error);
  }
};
