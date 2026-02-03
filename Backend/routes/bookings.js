const express = require('express');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { salonId, serviceName, servicePrice, serviceDuration, date, time, notes } = req.body;

    const booking = new Booking({
      userId: req.user.userId,
      salonId,
      serviceName,
      servicePrice,
      serviceDuration,
      totalPrice: servicePrice,
      date,
      time,
      notes
    });

    await booking.save();
    await booking.populate(['userId', 'salonId']);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('salonId')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status },
      { new: true }
    ).populate(['userId', 'salonId']);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;