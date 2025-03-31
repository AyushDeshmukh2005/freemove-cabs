
# GoCabs Backend

This is the backend server for the GoCabs ride-sharing application, built with Node.js, Express, and MySQL.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup Instructions

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

5. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

6. The server will be running at http://localhost:5000

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login a user
- GET /api/users/:id - Get user profile
- PATCH /api/users/:id - Update user profile
- PATCH /api/users/:id/quiet-hours - Update user's quiet hours settings

### Rides
- POST /api/rides - Book a new ride
- GET /api/rides/:id - Get a specific ride
- GET /api/rides/user/:userId - Get all rides for a user
- PATCH /api/rides/:id/status - Update ride status
- PATCH /api/rides/:id/rate - Rate a ride
- PATCH /api/rides/:id/cancel - Cancel a ride
- PATCH /api/rides/:id/discount - Apply ridesharing discount
- POST /api/rides/:id/stops - Add a stop to a ride
- PATCH /api/rides/:id/destination - Change ride destination
- POST /api/rides/:id/split-payment - Generate a split payment link

### Weather
- GET /api/weather/current/:location - Get current weather
- GET /api/weather/forecast/:location - Get weather forecast
- GET /api/weather/adjustment/:condition - Get price adjustment for weather

### Favorites
- POST /api/favorites/routes - Save a favorite route
- GET /api/favorites/routes/user/:userId - Get favorite routes for a user
- DELETE /api/favorites/routes/:id - Delete a favorite route
- POST /api/favorites/drivers - Save a favorite driver
- GET /api/favorites/drivers/user/:userId - Get favorite drivers for a user
- DELETE /api/favorites/drivers/:id - Delete a favorite driver
