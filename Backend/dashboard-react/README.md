# SalonEase React Dashboard

## Setup Instructions

### 1. Install Dependencies
```bash
cd Backend/dashboard-react
npm install
```

### 2. Start Backend Server
```bash
cd Backend
npm run seed-admin  # Create admin and salon owner accounts
npm run dev         # Start backend server
```

### 3. Start React Dashboard
```bash
cd Backend/dashboard-react
npm start
```

### 4. Access Dashboard
Open browser: `http://localhost:3000`

## Default Login Credentials

### Admin Dashboard
- **Email**: admin@salonease.com
- **Password**: admin123

### Salon Owner Dashboard  
- **Email**: owner@salon.com
- **Password**: owner123

## Features

### Admin Dashboard
- **Overview**: System statistics
- **Users Management**: View/delete users
- **Salons Management**: Approve/reject salons
- **Bookings**: View all platform bookings

### Salon Owner Dashboard
- **Overview**: Salon statistics
- **Salon Profile**: Update salon info
- **Services Management**: Add/edit/delete services
- **Bookings**: Manage salon bookings

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Backend**: Node.js + Express + MongoDB
- **API**: RESTful APIs with JWT authentication
- **Styling**: Inline styles (easily customizable)

## Project Structure
```
dashboard-react/
├── src/
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── UsersManagement.tsx
│   │   ├── SalonsManagement.tsx
│   │   ├── BookingsManagement.tsx
│   │   ├── SalonProfile.tsx
│   │   └── ServicesManagement.tsx
│   ├── types.ts
│   ├── apiService.ts
│   └── App.tsx
```