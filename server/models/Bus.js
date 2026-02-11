const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: [true, 'Please provide bus number'],
    unique: true,
    uppercase: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide bus capacity'],
    min: 1
  },
  currentOccupancy: {
    type: Number,
    default: 0
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  type: {
    type: String,
    enum: ['AC', 'Non-AC'],
    default: 'Non-AC'
  },
  registrationNumber: {
    type: String,
    required: true
  },
  insuranceExpiry: {
    type: Date,
    required: true
  },
  fitnessExpiry: {
    type: Date,
    required: true
  },
  lastServiceDate: {
    type: Date
  },
  nextServiceDate: {
    type: Date
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

module.exports = mongoose.model('Bus', busSchema);
