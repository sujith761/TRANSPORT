const TransportApplication = require('../models/TransportApplication');
const User = require('../models/User');
const Bus = require('../models/Bus');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Maintenance = require('../models/Maintenance');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
exports.getApplications = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.applicationType = type;

    const applications = await TransportApplication.find(query)
      .populate('user', 'name email registerNumber')
      .populate('route', 'routeName routeNumber startingPoint')
      .populate('currentRoute', 'routeName routeNumber')
      .populate('newRoute', 'routeName routeNumber')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve application
// @route   PUT /api/admin/applications/:id/approve
// @access  Private/Admin
exports.approveApplication = async (req, res, next) => {
  try {
    const application = await TransportApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Generate QR Code
    const qrData = {
      applicationId: application._id,
      studentName: application.name,
      registerNumber: application.registerNumber,
      route: application.route
    };
    const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

    application.status = 'approved';
    application.approvedBy = req.user.id;
    application.approvedAt = Date.now();
    application.qrCode = qrCode;
    await application.save();

    // Create notification for student
    await Notification.create({
      user: application.user,
      title: 'Application Approved',
      message: `Your transport application has been approved. Application Type: ${application.applicationType}`,
      type: 'success'
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('applicationApproved', {
      userId: application.user,
      application
    });

    res.status(200).json({
      success: true,
      message: 'Application approved successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject application
// @route   PUT /api/admin/applications/:id/reject
// @access  Private/Admin
exports.rejectApplication = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const application = await TransportApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = 'rejected';
    application.rejectionReason = reason || 'No reason provided';
    application.approvedBy = req.user.id;
    application.approvedAt = Date.now();
    await application.save();

    // Create notification for student
    await Notification.create({
      user: application.user,
      title: 'Application Rejected',
      message: `Your transport application has been rejected. Reason: ${application.rejectionReason}`,
      type: 'error'
    });

    const io = req.app.get('io');
    io.emit('applicationRejected', {
      userId: application.user,
      application
    });

    res.status(200).json({
      success: true,
      message: 'Application rejected',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    // Total students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Active (logged in) students - last login within 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeStudents = await User.countDocuments({
      role: 'student',
      lastLogin: { $gte: oneDayAgo }
    });

    // Total applications
    const totalApplications = await TransportApplication.countDocuments();

    // Pending applications
    const pendingApplications = await TransportApplication.countDocuments({ status: 'pending' });

    // Approved applications
    const approvedApplications = await TransportApplication.countDocuments({ status: 'approved' });

    // Total buses
    const totalBuses = await Bus.countDocuments();

    // Active buses
    const activeBuses = await Bus.countDocuments({ isActive: true });

    // Total drivers
    const totalDrivers = await Driver.countDocuments();

    // Total routes
    const totalRoutes = await Route.countDocuments();

    // Applications by type
    const applicationsByType = await TransportApplication.aggregate([
      {
        $group: {
          _id: '$applicationType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Students per route
    const studentsPerRoute = await TransportApplication.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$route',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'routes',
          localField: '_id',
          foreignField: '_id',
          as: 'routeInfo'
        }
      },
      { $unwind: '$routeInfo' },
      {
        $project: {
          routeName: '$routeInfo.routeName',
          routeNumber: '$routeInfo.routeNumber',
          students: '$count'
        }
      }
    ]);

    // Recent applications
    const recentApplications = await TransportApplication.find()
      .populate('user', 'name registerNumber')
      .populate('route', 'routeName')
      .sort('-createdAt')
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalBuses,
        activeBuses,
        totalDrivers,
        totalRoutes,
        applicationsByType,
        studentsPerRoute,
        recentApplications
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== DRIVER MANAGEMENT ====================

// @desc    Create driver
// @route   POST /api/admin/drivers
// @access  Private/Admin
exports.createDriver = async (req, res, next) => {
  try {
    const driver = await Driver.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all drivers
// @route   GET /api/admin/drivers
// @access  Private/Admin
exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find()
      .populate('assignedBus', 'busNumber routeName')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update driver
// @route   PUT /api/admin/drivers/:id
// @access  Private/Admin
exports.updateDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: driver
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete driver
// @route   DELETE /api/admin/drivers/:id
// @access  Private/Admin
exports.deleteDriver = async (req, res, next) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== BUS MANAGEMENT ====================

// @desc    Create bus
// @route   POST /api/admin/buses
// @access  Private/Admin
exports.createBus = async (req, res, next) => {
  try {
    const bus = await Bus.create(req.body);

    // Update driver's assigned bus
    if (req.body.driver) {
      await Driver.findByIdAndUpdate(req.body.driver, { assignedBus: bus._id });
    }

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all buses
// @route   GET /api/admin/buses
// @access  Private/Admin
exports.getBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find()
      .populate('driver', 'name phone licenseNumber')
      .populate('route', 'routeName routeNumber startingPoint endingPoint')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bus
// @route   PUT /api/admin/buses/:id
// @access  Private/Admin
exports.updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus updated successfully',
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bus
// @route   DELETE /api/admin/buses/:id
// @access  Private/Admin
exports.deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: 'Bus not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bus deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== ROUTE MANAGEMENT ====================

// @desc    Create route
// @route   POST /api/admin/routes
// @access  Private/Admin
exports.createRoute = async (req, res, next) => {
  try {
    const route = await Route.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update route
// @route   PUT /api/admin/routes/:id
// @access  Private/Admin
exports.updateRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Route updated successfully',
      data: route
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete route
// @route   DELETE /api/admin/routes/:id
// @access  Private/Admin
exports.deleteRoute = async (req, res, next) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ==================== MAINTENANCE MANAGEMENT ====================

// @desc    Create maintenance record
// @route   POST /api/admin/maintenance
// @access  Private/Admin
exports.createMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.create(req.body);

    // Update bus service dates
    if (req.body.maintenanceType === 'Service') {
      await Bus.findByIdAndUpdate(req.body.bus, {
        lastServiceDate: req.body.serviceDate,
        nextServiceDate: req.body.nextServiceDate
      });
    }

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: maintenance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all maintenance records
// @route   GET /api/admin/maintenance
// @access  Private/Admin
exports.getMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.find()
      .populate('bus', 'busNumber registrationNumber')
      .sort('-serviceDate');

    res.status(200).json({
      success: true,
      count: maintenance.length,
      data: maintenance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance record
// @route   PUT /api/admin/maintenance/:id
// @access  Private/Admin
exports.updateMaintenance = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!maintenance) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: maintenance
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search student by register number
// @route   GET /api/admin/students/search/:regNo
// @access  Private/Admin
exports.searchStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({
      registerNumber: req.params.regNo.toUpperCase()
    }).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get student's applications
    const applications = await TransportApplication.find({ user: student._id })
      .populate('route', 'routeName routeNumber')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        student,
        applications
      }
    });
  } catch (error) {
    next(error);
  }
};
