const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  stopName: {
    type: String,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  landmark: {
    type: String
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: [true, 'Please provide route name'],
    unique: true
  },
  routeNumber: {
    type: String,
    required: [true, 'Please provide route number'],
    unique: true
  },
  startingPoint: {
    type: String,
    required: [true, 'Please provide starting point']
  },
  endingPoint: {
    type: String,
    required: [true, 'Please provide ending point'],
    default: 'KASC Campus'
  },
  stops: [stopSchema],
  startTime: {
    type: String,
    required: [true, 'Please provide start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide end time']
  },
  distance: {
    type: Number,
    default: 0
  },
  estimatedDuration: {
    type: String
  },
  fare: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Route', routeSchema);
