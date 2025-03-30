
# GoCabs Backend

This is the backend server for the GoCabs application. It provides APIs for weather data, ride management, user authentication, and more.

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

## Setup

1. Install dependencies:
   ```bash
   cd src/server
   npm install
   ```

2. Configure environment variables:
   Create a `.env` file in the `src/server` directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=gocabs_db
   JWT_SECRET=your_secret_key
   PORT=5000
   WEATHER_API_KEY=your_openweathermap_api_key
   ```

3. Set up the database:
   ```bash
   npm run setup-db
   ```

4. Start the server:
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. The server will be running at http://localhost:5000

## API Endpoints

### Authentication
- POST /api/users/register - Register a new user
- POST /api/users/login - Login a user

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

## Database Schema

The database consists of several tables:
- users - User accounts
- rides - Ride details
- ride_stops - Additional stops for rides
- favorite_routes - Saved routes
- favorite_drivers - Saved drivers
- driver_rewards - Driver reward points
- driver_achievements - Driver achievements
- quiet_hours - User notification preferences
- weather_data - Weather data cache
- landmarks - Notable locations

See `db/schema.sql` for the complete database schema.
