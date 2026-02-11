const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide driver name'],
    trim: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please provide license number'],
    unique: true,
    uppercase: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  experience: {
    type: Number,
    default: 0
  },
  assignedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', driverSchema);
