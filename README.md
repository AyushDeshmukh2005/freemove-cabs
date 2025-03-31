
# FreeMoves Cabs - Ride Sharing Application

FreeMoves Cabs is a full-stack ride-sharing application with separate frontend and backend components.

## Project Structure

- `/src/FrontEnd` - React frontend application
- `/src/BackEnd` - Node.js/Express backend server
- `/src/BackEnd/Database` - MySQL database setup and connection

## Setting Up the Project

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd src/BackEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the `src` directory based on `.env.example`:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=gocabs_db
   JWT_SECRET=your_secret_key
   PORT=5000
   WEATHER_API_KEY=your_api_key
   ```

4. Set up the database:
   ```bash
   npm run setup-db
   ```

5. Start the backend server:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Make sure you have Node.js installed

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to http://localhost:5173

## Features

- User authentication and profiles
- Ride booking and tracking
- Favorite routes and drivers
- Ride history and ratings
- Driver rewards system
- Weather-aware pricing
- Split payments
- Multiple stops for rides
- Emergency contacts
- Theme customization
- Quiet hours settings
- Fare negotiation system
- Monthly subscription plans

## Unique Features

### Fare Negotiation System
- Users can propose their own fare for rides
- Drivers can accept, reject, or counter-offer
- Real-time negotiation updates

### Subscription-Based Rides
- Monthly passes for regular commuters
- Discounted rates on prepaid rides
- Multiple tier options

### Preferred Driver System
- Save favorite drivers for future rides
- Build a trusted network of drivers

### Multi-Stop Booking
- Add multiple destinations in a single ride
- Enhanced convenience for users

## Tech Stack

- **Frontend**: React, TailwindCSS, React Router, Tanstack Query
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT
