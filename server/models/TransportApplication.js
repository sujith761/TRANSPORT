const mongoose = require('mongoose');

const transportApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  registerNumber: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true,
    enum: ['I Year', 'II Year', 'III Year']
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route',
    required: true
  },
  applicationType: {
    type: String,
    enum: ['new', 'change', 'cancel'],
    default: 'new'
  },
  currentRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  newRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  reason: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TransportApplication', transportApplicationSchema);
