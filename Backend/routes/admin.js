const express = require('express');
const User = require('../models/User');
const Salon = require('../models/Salon');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check admin role
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get dashboard stats
router.get('/dashboard/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalSalons = await Salon.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingSalons = await Salon.countDocuments({ isApproved: false });

    res.json({
      totalUsers,
      totalSalons,
      totalBookings,
      pendingSalons
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password -otp')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all salons
router.get('/salons', auth, adminAuth, async (req, res) => {
  try {
    const salons = await Salon.find()
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(salons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve/reject salon
router.patch('/salons/:id/approval', auth, adminAuth, async (req, res) => {
  try {
    const { isApproved } = req.body;
    const salon = await Salon.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bookings
router.get('/bookings', auth, adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('salonId', 'name address')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete salon
router.delete('/salons/:id', auth, adminAuth, async (req, res) => {
  try {
    await Salon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Salon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;