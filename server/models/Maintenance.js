const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  maintenanceType: {
    type: String,
    enum: ['Service', 'Repair', 'Insurance Renewal', 'Fitness Check', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    default: 0
  },
  serviceDate: {
    type: Date,
    required: true
  },
  nextServiceDate: {
    type: Date
  },
  servicedBy: {
    type: String
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed'],
    default: 'Scheduled'
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);
