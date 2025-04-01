
-- GoCabs Database Schema

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  type ENUM('rider', 'driver') NOT NULL DEFAULT 'rider',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Rides Table
CREATE TABLE IF NOT EXISTS rides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  driverId VARCHAR(255),
  startAddress VARCHAR(255) NOT NULL,
  startLat DECIMAL(10, 8) NOT NULL,
  startLng DECIMAL(11, 8) NOT NULL,
  endAddress VARCHAR(255) NOT NULL,
  endLat DECIMAL(10, 8) NOT NULL,
  endLng DECIMAL(11, 8) NOT NULL,
  status ENUM('pending', 'accepted', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  fare DECIMAL(10, 2) NOT NULL,
  distance DECIMAL(10, 2) NOT NULL,
  duration INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  paymentMethod ENUM('cash', 'card', 'wallet') NOT NULL DEFAULT 'cash',
  rideType ENUM('standard', 'premium', 'eco') NOT NULL DEFAULT 'standard',
  driverRating TINYINT,
  userRating TINYINT,
  estimatedArrival DATETIME,
  isShared BOOLEAN DEFAULT FALSE,
  appliedDiscount DECIMAL(5, 2),
  rideMood ENUM('chatty', 'quiet', 'work', 'music'),
  weatherAdjustment DECIMAL(5, 2),
  splitPaymentLink VARCHAR(255),
  nearbyLandmark VARCHAR(255),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Ride Stops Table
CREATE TABLE IF NOT EXISTS ride_stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rideId INT NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  isCompleted BOOLEAN DEFAULT FALSE,
  position INT NOT NULL,
  FOREIGN KEY (rideId) REFERENCES rides(id) ON DELETE CASCADE
);

-- Favorite Routes Table
CREATE TABLE IF NOT EXISTS favorite_routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  startAddress VARCHAR(255) NOT NULL,
  startLat DECIMAL(10, 8) NOT NULL,
  startLng DECIMAL(11, 8) NOT NULL,
  endAddress VARCHAR(255) NOT NULL,
  endLat DECIMAL(10, 8) NOT NULL,
  endLng DECIMAL(11, 8) NOT NULL,
  createdAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Favorite Drivers Table
CREATE TABLE IF NOT EXISTS favorite_drivers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  driverId VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Driver Rewards Table
CREATE TABLE IF NOT EXISTS driver_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driverId VARCHAR(255) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  level ENUM('bronze', 'silver', 'gold', 'platinum') NOT NULL DEFAULT 'bronze',
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Driver Achievements Table
CREATE TABLE IF NOT EXISTS driver_achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  driverId VARCHAR(255) NOT NULL,
  achievementId VARCHAR(50) NOT NULL,
  awardedAt DATETIME NOT NULL
);

-- Quiet Hours Table
CREATE TABLE IF NOT EXISTS quiet_hours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  daysOfWeek JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Weather Data Table
CREATE TABLE IF NOT EXISTS weather_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  condition VARCHAR(50) NOT NULL,
  temperature DECIMAL(5, 2) NOT NULL,
  humidity INT NOT NULL,
  windSpeed DECIMAL(5, 2) NOT NULL,
  recordedAt DATETIME NOT NULL
);

-- Landmarks Table
CREATE TABLE IF NOT EXISTS landmarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  category VARCHAR(50),
  createdAt DATETIME NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_rides_userId ON rides(userId);
CREATE INDEX idx_ride_stops_rideId ON ride_stops(rideId);
CREATE INDEX idx_favorite_routes_userId ON favorite_routes(userId);
CREATE INDEX idx_favorite_drivers_userId ON favorite_drivers(userId);
CREATE INDEX idx_quiet_hours_userId ON quiet_hours(userId);
CREATE INDEX idx_landmarks_location ON landmarks(lat, lng);
