const TransportApplication = require('../models/TransportApplication');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

// @desc    Apply for transport
// @route   POST /api/transport/apply
// @access  Private
exports.applyTransport = async (req, res, next) => {
  try {
    const applicationData = {
      ...req.body,
      user: req.user.id
    };

    const application = await TransportApplication.create(applicationData);

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Application Submitted',
      message: 'Your transport application has been submitted successfully and is pending approval.',
      type: 'info'
    });

    // Emit socket event
    const io = req.app.get('io');
    io.emit('newApplication', {
      message: 'New transport application received',
      application
    });

    res.status(201).json({
      success: true,
      message: 'Transport application submitted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change route request
// @route   POST /api/transport/change
// @access  Private
exports.changeRoute = async (req, res, next) => {
  try {
    const applicationData = {
      ...req.body,
      user: req.user.id,
      applicationType: 'change',
      route: req.body.newRoute
    };

    const application = await TransportApplication.create(applicationData);

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Route Change Request Submitted',
      message: 'Your route change request has been submitted and is pending approval.',
      type: 'info'
    });

    const io = req.app.get('io');
    io.emit('routeChangeRequest', { application });

    res.status(201).json({
      success: true,
      message: 'Route change request submitted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel route request
// @route   POST /api/transport/cancel
// @access  Private
exports.cancelRoute = async (req, res, next) => {
  try {
    const applicationData = {
      ...req.body,
      user: req.user.id,
      applicationType: 'cancel',
      route: req.body.currentRoute
    };

    const application = await TransportApplication.create(applicationData);

    // Create notification
    await Notification.create({
      user: req.user.id,
      title: 'Cancellation Request Submitted',
      message: 'Your route cancellation request has been submitted and is pending approval.',
      type: 'info'
    });

    const io = req.app.get('io');
    io.emit('cancellationRequest', { application });

    res.status(201).json({
      success: true,
      message: 'Route cancellation request submitted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student application status
// @route   GET /api/transport/status
// @access  Private
exports.getApplicationStatus = async (req, res, next) => {
  try {
    const applications = await TransportApplication.find({ user: req.user.id })
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

// @desc    Get notifications
// @route   GET /api/transport/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort('-createdAt')
      .limit(20);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/transport/notifications/:id/read
// @access  Private
exports.markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};
