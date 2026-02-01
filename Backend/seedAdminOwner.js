const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Salon = require('./models/Salon');
require('dotenv').config();

const seedAdminAndOwners = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
    
    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@salonease.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        name: 'System Admin',
        email: 'admin@salonease.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'admin',
        isVerified: true
      });
      await admin.save();
      console.log('Admin user created');
    }

    // Create salon owner
    const ownerExists = await User.findOne({ email: 'owner@salon.com' });
    if (!ownerExists) {
      const hashedPassword = await bcrypt.hash('owner123', 10);
      const owner = new User({
        name: 'Salon Owner',
        email: 'owner@salon.com',
        password: hashedPassword,
        phone: '+1234567891',
        role: 'salon_owner',
        isVerified: true
      });
      await owner.save();

      // Create salon for the owner
      const salon = new Salon({
        name: 'Bella Rinova Salon',
        address: '123 Beauty Street, City Center',
        location: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        phone: '+1234567891',
        email: 'owner@salon.com',
        ownerId: owner._id,
        isApproved: true,
        services: [
          { name: 'Haircut', price: 25, duration: 30 },
          { name: 'Hair Wash', price: 15, duration: 20 },
          { name: 'Styling', price: 35, duration: 45 }
        ],
        workingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: 'closed', close: 'closed' }
        }
      });
      await salon.save();

      // Update owner with salon ID
      owner.salonId = salon._id;
      await owner.save();
      
      console.log('Salon owner and salon created');
    }

    console.log('Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAdminAndOwners();