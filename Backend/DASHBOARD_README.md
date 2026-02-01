# SalonEase Admin & Salon Owner Dashboard

## Setup Instructions

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Create Admin and Salon Owner Accounts
```bash
npm run seed-admin
```

This creates:
- **Admin Account**: admin@salonease.com / admin123
- **Salon Owner Account**: owner@salon.com / owner123

### 3. Start the Server
```bash
npm run dev
```

### 4. Access the Dashboard
Open your browser and go to: `http://localhost:5000/dashboard`

## Default Login Credentials

### Admin Dashboard
- **Email**: admin@salonease.com
- **Password**: admin123

### Salon Owner Dashboard
- **Email**: owner@salon.com
- **Password**: owner123

## Features

### Admin Dashboard
- **Overview**: View system statistics (total users, salons, bookings)
- **Users Management**: View and manage all users
- **Salons Management**: Approve/reject salon registrations
- **Bookings**: View all bookings across the platform

### Salon Owner Dashboard
- **Overview**: View salon-specific statistics
- **Salon Profile**: Update salon information
- **Services Management**: Add, edit, delete services
- **Bookings**: Manage salon bookings (confirm/cancel)
- **Revenue Reports**: View earnings and booking statistics

## API Endpoints

### Admin Routes (`/api/admin`)
- `GET /dashboard/stats` - Dashboard statistics
- `GET /users` - All users
- `GET /salons` - All salons
- `GET /bookings` - All bookings
- `PATCH /salons/:id/approval` - Approve/reject salon
- `DELETE /users/:id` - Delete user
- `DELETE /salons/:id` - Delete salon

### Salon Owner Routes (`/api/salon-owner`)
- `GET /dashboard/stats` - Salon statistics
- `GET /profile` - Salon profile
- `PUT /profile` - Update salon profile
- `POST /services` - Add service
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service
- `GET /bookings` - Salon bookings
- `PATCH /bookings/:id/status` - Update booking status
- `GET /reports/revenue` - Revenue report

## Database Models Updated

### User Model
- Added `role` field (customer, salon_owner, admin)
- Added `salonId` reference for salon owners

### Salon Model
- Added `ownerId` reference to User
- Added `isApproved` status for admin approval
- Added `isActive` status

## Authentication
- JWT tokens include user role and salon ID
- Role-based access control for admin and salon owner routes
- Dashboard automatically shows/hides features based on user role

## Next Steps
1. Run the seed script to create test accounts
2. Start the server
3. Access the dashboard and test the functionality
4. Customize the UI as needed for your brand