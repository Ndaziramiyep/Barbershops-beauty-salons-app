const express = require('express');
const Booking = require('../models/Booking');
const Salon = require('../models/Salon');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, async (req, res) => {
  try {
    const { salonId, serviceName, servicePrice, serviceDuration, date, time, notes } = req.body;

    // Validate required fields
    if (!salonId || !serviceName || !servicePrice || !date || !time) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // Verify salon exists and is active
    const salon = await Salon.findOne({ _id: salonId, isApproved: true, isActive: true });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found or not available' });
    }

    const booking = new Booking({
      userId: req.user.userId,
      salonId,
      serviceName,
      servicePrice: Number(servicePrice),
      serviceDuration: Number(serviceDuration) || 30,
      totalPrice: Number(servicePrice),
      date: new Date(date),
      time,
      notes: notes || ''
    });

    await booking.save();
    await booking.populate(['userId', 'salonId']);

    console.log(`Booking created for user ${req.user.userId} at salon ${salon.name}`);
    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to create booking', error: error.message });
  }
});

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('salonId', 'name address phone')
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${bookings.length} bookings for user ${req.user.userId}`);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { status },
      { new: true }
    ).populate(['userId', 'salonId']);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    console.log(`Booking ${id} status updated to ${status}`);
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
});

module.exports = router;