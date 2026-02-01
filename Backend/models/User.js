const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    default: null
  },
  otpExpires: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['customer', 'salon_owner', 'admin'],
    default: 'customer'
  },
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salon',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);