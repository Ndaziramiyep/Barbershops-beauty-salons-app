# Barbershop & Beauty Salon App Setup

## Backend Setup

1. Navigate to Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create .env file with:
```
MONGODB_URI=mongodb://localhost:27017/barbershop
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

## Frontend Setup

1. Navigate to project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Start the Expo development server:
```bash
npx expo start
```

## Database Integration Features

✅ **FAQs Screen**: Now loads from database with fallback to static data
✅ **Home Screen**: Displays nearest salon from database
✅ **Salon Details**: Loads salon information from database
✅ **API Services**: Centralized API calls with error handling
✅ **Data Seeding**: Populated database with sample salons and FAQs

## API Endpoints

- `GET /api/salons` - Get all salons
- `GET /api/salons/nearby` - Get nearby salons
- `GET /api/salons/:id` - Get salon by ID
- `GET /api/faqs` - Get all active FAQs
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

## Notes

- The app maintains UI/UX design while integrating database functionality
- Fallback static data ensures app works even if API is unavailable
- All screens maintain existing structure and styling
- Database integration is seamless with loading states and error handling