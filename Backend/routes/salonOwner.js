const express = require('express');
const Salon = require('../models/Salon');
const Booking = require('../models/Booking');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check salon owner role
const salonOwnerAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'salon_owner') {
      return res.status(403).json({ message: 'Access denied. Salon owner only.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get salon owner dashboard stats
router.get('/dashboard/stats', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const totalBookings = await Booking.countDocuments({ salonId: salon._id });
    const todayBookings = await Booking.countDocuments({
      salonId: salon._id,
      date: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lt: new Date().setHours(23, 59, 59, 999)
      }
    });
    const pendingBookings = await Booking.countDocuments({
      salonId: salon._id,
      status: 'pending'
    });

    res.json({
      totalBookings,
      todayBookings,
      pendingBookings,
      totalServices: salon.services.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get salon profile
router.get('/profile', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update salon profile
router.put('/profile', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOneAndUpdate(
      { ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add service
router.post('/services', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    salon.services.push(req.body);
    await salon.save();
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update service
router.put('/services/:serviceId', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const service = salon.services.id(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    Object.assign(service, req.body);
    await salon.save();
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete service
router.delete('/services/:serviceId', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    salon.services.pull(req.params.serviceId);
    await salon.save();
    res.json(salon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get salon bookings
router.get('/bookings', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const bookings = await Booking.find({ salonId: salon._id })
      .populate('userId', 'name email phone')
      .sort({ date: -1, time: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/bookings/:id/status', auth, salonOwnerAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get revenue report
router.get('/reports/revenue', auth, salonOwnerAuth, async (req, res) => {
  try {
    const salon = await Salon.findOne({ ownerId: req.user.id });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const { startDate, endDate } = req.query;
    const matchCondition = {
      salonId: salon._id,
      status: 'completed'
    };

    if (startDate && endDate) {
      matchCondition.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const revenue = await Booking.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalPrice' },
          totalBookings: { $sum: 1 }
        }
      }
    ]);

    res.json(revenue[0] || { totalRevenue: 0, totalBookings: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;