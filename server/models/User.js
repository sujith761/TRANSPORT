const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  registerNumber: {
    type: String,
    required: [true, 'Please provide register number'],
    unique: true,
    uppercase: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  mobile: {
    type: String,
    required: [true, 'Please provide mobile number'],
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number']
  },
  department: {
    type: String,
    required: [true, 'Please select department'],
    enum: [
      'B.Sc CS', 'B.Sc IT', 'B.Com', 'BBA', 'BCA', 'B.A English',
      'B.Sc Maths', 'B.Sc Physics', 'B.Sc Chemistry',
      'M.Sc CS', 'M.Sc IT', 'M.Com', 'MBA', 'MCA',
      'M.A English', 'M.Sc Maths'
    ]
  },
  city: {
    type: String,
    required: [true, 'Please provide city']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
