
# GoCabs Frontend

This is the frontend application for the GoCabs ride-sharing platform, built with React.

## Features

- User authentication (login/signup)
- Ride booking and tracking
- Favorite routes and drivers
- Ride history
- Driver rewards system
- Emergency contacts
- Theme customization
- Quiet hours settings
- Weather-aware pricing

## Structure

- `/components` - Reusable UI components
- `/context` - React context providers for global state management
- `/hooks` - Custom React hooks
- `/pages` - Page components for routing
- `/services` - Service modules for API calls and business logic

## Key Components

- RideBookingForm - Form for booking rides
- RideMoodSelector - Select mood preferences for rides
- FavoriteRoutes - Manage saved routes
- FavoriteDrivers - Manage favorite drivers
- QuietHoursSettings - Configure quiet hours preferences

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

The frontend communicates with the backend API running on http://localhost:5000
