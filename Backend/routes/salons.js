const express = require('express');
const Salon = require('../models/Salon');

const router = express.Router();

// Get all salons
router.get('/', async (req, res) => {
  try {
    const salons = await Salon.find({ isApproved: true, isActive: true })
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 });
    console.log(`Found ${salons.length} approved salons`);
    res.json(salons);
  } catch (error) {
    console.error('Error fetching salons:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get nearby salons
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const salons = await Salon.find({
      isApproved: true,
      isActive: true,
      'location.latitude': {
        $gte: parseFloat(latitude) - radius / 111,
        $lte: parseFloat(latitude) + radius / 111
      },
      'location.longitude': {
        $gte: parseFloat(longitude) - radius / 111,
        $lte: parseFloat(longitude) + radius / 111
      }
    }).populate('ownerId', 'name email phone');

    res.json(salons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get salon by ID
router.get('/:id', async (req, res) => {
  try {
    const salon = await Salon.findOne({ 
      _id: req.params.id, 
      isApproved: true, 
      isActive: true 
    }).populate('ownerId', 'name email phone');
    
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }
    res.json(salon);
  } catch (error) {
    console.error('Error fetching salon by ID:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;