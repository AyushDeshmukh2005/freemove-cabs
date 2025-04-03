
# FreeMoves Cabs - Ride Sharing Application

FreeMoves Cabs is a ride-sharing application with separate frontend, backend, and database components.

## Project Structure

- `/FrontEnd` - React frontend application
- `/BackEnd` - Node.js/Express backend server
- `/Database` - MySQL database setup and connection

## Setting Up the Project

### Database Setup

1. Navigate to the project root directory
2. Make sure you have MySQL installed and running
3. Create a `.env` file in the root directory with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=gocabs_db
   JWT_SECRET=your_secret_key
   PORT=5000
   WEATHER_API_KEY=your_api_key
   ```
4. Run the database setup script:
   ```bash
   cd BackEnd
   npm run setup-db
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd BackEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Make sure you have Node.js installed
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to http://localhost:8080

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

## Tech Stack

- **Frontend**: React, TailwindCSS, React Router, Tanstack Query
- **Backend**: Node.js, Express
- **Database**: MySQL
- **Authentication**: JWT.
