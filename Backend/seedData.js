const mongoose = require('mongoose');
const Salon = require('./models/Salon');
const FAQ = require('./models/FAQ');
require('dotenv').config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/barbershop');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Salon.deleteMany({});
    await FAQ.deleteMany({});
    console.log('Cleared existing data');

    // Seed Salons
    const salons = [
      {
        name: 'Bella Rinova',
        address: '123 Lygon St, Carlton Melbourne 3053',
        location: {
          latitude: -37.8136,
          longitude: 144.9631
        },
        phone: '+61 3 9347 1234',
        email: 'info@bellarinova.com',
        rating: 4.8,
        image: 'salon-image1.png',
        services: [
          { name: 'Haircut', price: 45, duration: 60 },
          { name: 'Hair Wash', price: 25, duration: 30 },
          { name: 'Hair Styling', price: 35, duration: 45 }
        ],
        workingHours: {
          monday: { open: '9:00', close: '18:00' },
          tuesday: { open: '9:00', close: '18:00' },
          wednesday: { open: '9:00', close: '18:00' },
          thursday: { open: '9:00', close: '18:00' },
          friday: { open: '9:00', close: '19:00' },
          saturday: { open: '8:00', close: '17:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      },
      {
        name: 'The Galleria Hair Salon',
        address: '456 Collins St, Melbourne VIC 3000',
        location: {
          latitude: -37.8142,
          longitude: 144.9632
        },
        phone: '+61 3 9654 3210',
        email: 'contact@galleriahair.com',
        rating: 4.6,
        image: 'salon-image2.jpg',
        services: [
          { name: 'Premium Cut', price: 65, duration: 75 },
          { name: 'Color Treatment', price: 120, duration: 120 },
          { name: 'Beard Trim', price: 30, duration: 30 }
        ],
        workingHours: {
          monday: { open: '8:30', close: '17:30' },
          tuesday: { open: '8:30', close: '17:30' },
          wednesday: { open: '8:30', close: '17:30' },
          thursday: { open: '8:30', close: '19:00' },
          friday: { open: '8:30', close: '19:00' },
          saturday: { open: '8:00', close: '16:00' },
          sunday: { open: 'closed', close: 'closed' }
        }
      },
      {
        name: 'Style & Grace Beauty',
        address: '789 Chapel St, South Yarra VIC 3141',
        location: {
          latitude: -37.8456,
          longitude: 144.9875
        },
        phone: '+61 3 9827 5678',
        email: 'hello@styleandgrace.com',
        rating: 4.9,
        image: 'salon-image4.jpg',
        services: [
          { name: 'Bridal Makeup', price: 200, duration: 180 },
          { name: 'Manicure', price: 40, duration: 60 },
          { name: 'Facial Treatment', price: 80, duration: 90 }
        ],
        workingHours: {
          monday: { open: '9:00', close: '18:00' },
          tuesday: { open: '9:00', close: '18:00' },
          wednesday: { open: '9:00', close: '18:00' },
          thursday: { open: '9:00', close: '20:00' },
          friday: { open: '9:00', close: '20:00' },
          saturday: { open: '8:00', close: '18:00' },
          sunday: { open: '10:00', close: '17:00' }
        }
      }
    ];

    await Salon.insertMany(salons);
    console.log('Salons seeded successfully');

    // Seed FAQs
    const faqs = [
      {
        question: 'What is Flo Cutters?',
        answer: 'Flo Cutters is a premium barbershop and beauty salon booking platform that connects you with top-rated professionals in your area.',
        order: 1,
        isActive: true
      },
      {
        question: 'How much does this cost?',
        answer: 'We provide highest services without the highest price. A moderate price allows us to provide the best services at a reasonable cost. Our lower price allows you to enjoy it more often! Prices for services are subject to consultation.',
        order: 2,
        isActive: true
      },
      {
        question: 'Do you accept paypal?',
        answer: 'Yes, we accept PayPal along with all major credit cards and digital payment methods for your convenience.',
        order: 3,
        isActive: true
      },
      {
        question: 'Where are you located?',
        answer: 'We have multiple locations across the city. You can find our nearest salon using the location feature in the app.',
        order: 4,
        isActive: true
      },
      {
        question: 'Can I just come in or do I have to make an appointment?',
        answer: 'While walk-ins are welcome based on availability, we highly recommend booking an appointment through our app to guarantee your preferred time slot and stylist.',
        order: 5,
        isActive: true
      },
      {
        question: 'What safety measures do you have in place?',
        answer: 'We follow strict hygiene protocols including sanitized tools, clean workstations, and health screenings to ensure your safety.',
        order: 6,
        isActive: true
      },
      {
        question: 'Can I cancel or reschedule my appointment?',
        answer: 'Yes, you can cancel or reschedule your appointment up to 24 hours before your scheduled time through the app.',
        order: 7,
        isActive: true
      }
    ];

    await FAQ.insertMany(faqs);
    console.log('FAQs seeded successfully');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();