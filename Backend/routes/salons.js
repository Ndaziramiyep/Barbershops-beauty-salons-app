const express = require('express');
const Salon = require('../models/Salon');

const router = express.Router();

// Get all salons
router.get('/', async (req, res) => {
  try {
    const query = { isApproved: true, isActive: true };
    const salons = await Salon.find(query)
      .populate('ownerId', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`Found ${salons.length} approved salons`);
    res.json(salons);
  } catch (error) {
    console.error('Error fetching salons:', error);
    res.status(500).json({ message: 'Failed to fetch salons', error: error.message });
  }
});

// Get nearby salons
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
      return res.status(400).json({ message: 'Invalid coordinates or radius' });
    }

    const salons = await Salon.find({
      isApproved: true,
      isActive: true,
      'location.latitude': {
        $gte: lat - rad / 111,
        $lte: lat + rad / 111
      },
      'location.longitude': {
        $gte: lng - rad / 111,
        $lte: lng + rad / 111
      }
    }).populate('ownerId', 'name email phone').lean();

    console.log(`Found ${salons.length} nearby salons for coordinates ${lat}, ${lng}`);
    res.json(salons);
  } catch (error) {
    console.error('Error fetching nearby salons:', error);
    res.status(500).json({ message: 'Failed to fetch nearby salons', error: error.message });
  }
});

// Get salon by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid salon ID format' });
    }

    const salon = await Salon.findOne({ 
      _id: id, 
      isApproved: true, 
      isActive: true 
    }).populate('ownerId', 'name email phone').lean();
    
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found or not available' });
    }
    
    console.log(`Fetched salon: ${salon.name}`);
    res.json(salon);
  } catch (error) {
    console.error('Error fetching salon by ID:', error);
    res.status(500).json({ message: 'Failed to fetch salon', error: error.message });
  }
});

module.exports = router;