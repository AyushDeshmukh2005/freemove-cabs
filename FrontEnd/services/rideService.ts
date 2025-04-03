
import axios from 'axios';
import { db } from '../../Database/database';
import { weatherService } from './weatherService';

// Type definitions
export type Location = {
  address: string;
  lat: number;
  lng: number;
};

export type Ride = {
  id: string;
  userId: string;
  driverId?: string;
  startLocation: Location;
  endLocation: Location;
  stops?: Location[];
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod: 'cash' | 'card' | 'wallet';
  rideType: 'standard' | 'premium' | 'eco';
  driverRating?: number;
  userRating?: number;
  estimatedArrival?: Date;
  isShared: boolean;
  appliedDiscount?: number;
  rideMood?: 'chatty' | 'quiet' | 'work' | 'music';
  weatherAdjustment?: number;
  splitPaymentLink?: string;
  nearbyLandmark?: string;
  isRated?: boolean;
};

export type RideStop = {
  id: string;
  rideId: string;
  location: Location;
  isCompleted: boolean;
  position: number;
};

export type FavoriteRoute = {
  id: string;
  userId: string;
  name: string;
  startLocation: Location;
  endLocation: Location;
  createdAt: Date;
};

export type FavoriteDriver = {
  id: string;
  userId: string;
  driverId: string;
  createdAt: Date;
};

// Calculate a route between two locations with optional stops
export const calculateRoute = (
  pickupLocation: string, 
  destination: string, 
  stops: string[] = []
): { distance: number; duration: number } => {
  // This would normally call a maps API
  // Here we just simulate the calculation
  const baseDistance = Math.floor(Math.random() * 20) + 5; // 5-25km
  const baseDuration = Math.floor(baseDistance * 3 * 60); // ~3 min per km in seconds
  
  // Add distance and time for each stop
  const stopsCount = stops.length;
  const stopsDistance = stopsCount * 2; // 2km per stop
  const stopsDuration = stopsCount * 5 * 60; // 5 min per stop in seconds
  
  return {
    distance: baseDistance + stopsDistance,
    duration: baseDuration + stopsDuration
  };
};

// Calculate fare based on distance, duration, and ride type
export const calculateFare = (
  distance: number, 
  duration: number, 
  rideType: 'standard' | 'premium' | 'eco' = 'standard',
  isShared: boolean = false,
  existingDiscount: number = 0,
  weatherCondition: string = 'clear'
): number => {
  // Base prices
  const basePrices = {
    standard: 5.00, // Base fare for standard
    premium: 10.00, // Base fare for premium
    eco: 4.50      // Base fare for eco-friendly
  };
  
  // Price per km
  const pricePerKm = {
    standard: 1.50,
    premium: 2.25,
    eco: 1.35
  };
  
  // Price per minute (converted from seconds)
  const pricePerMinute = {
    standard: 0.30,
    premium: 0.45,
    eco: 0.25
  };
  
  // Calculate the base fare components
  const baseFare = basePrices[rideType];
  const distanceCost = distance * pricePerKm[rideType];
  const timeCost = (duration / 60) * pricePerMinute[rideType]; // Convert seconds to minutes
  
  // Calculate initial fare
  let fare = baseFare + distanceCost + timeCost;
  
  // Apply eco discount (10%)
  if (rideType === 'eco') {
    fare *= 0.9; // 10% discount
  }
  
  // Apply ridesharing discount
  if (isShared) {
    fare *= (1 - existingDiscount);
  }
  
  // Apply weather adjustment
  const weatherAdjustment = weatherService.getPriceAdjustmentForWeather(weatherCondition);
  if (weatherAdjustment !== 0) {
    fare *= (1 + weatherAdjustment);
  }
  
  // Round to 2 decimal places
  return Math.round(fare * 100) / 100;
};

// Book a new ride
export const bookRide = async (
  userId: string,
  pickupLocation: string,
  destination: string,
  rideType: 'standard' | 'premium' | 'eco' = 'standard',
  paymentMethod: 'cash' | 'card' | 'wallet' = 'cash',
  options?: any,
  negotiatedFare?: number
): Promise<Ride> => {
  try {
    // Calculate route information
    const { distance, duration } = calculateRoute(pickupLocation, destination, options?.stops);
    
    // Calculate fare (if not already negotiated)
    const fare = negotiatedFare || calculateFare(
      distance, 
      duration, 
      rideType, 
      options?.isShared || false, 
      0,
      options?.weatherCondition || 'clear'
    );
    
    // Prepare ride object
    const ride: Ride = {
      id: `ride-${Date.now()}`,
      userId,
      startLocation: {
        address: pickupLocation,
        lat: Math.random() * 180 - 90, // Random for demo
        lng: Math.random() * 360 - 180
      },
      endLocation: {
        address: destination,
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
      },
      status: 'pending',
      fare,
      distance,
      duration,
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethod,
      rideType,
      isShared: options?.isShared || false,
      rideMood: options?.rideMood,
      nearbyLandmark: options?.nearbyLandmark
    };
    
    // Add optional fields
    if (options?.weatherAdjustment) {
      ride.weatherAdjustment = options.weatherAdjustment;
    }
    
    // Insert into database
    await db.insert('rides', ride);
    
    // Process stops if any
    if (options?.stops && Array.isArray(options.stops)) {
      for (let i = 0; i < options.stops.length; i++) {
        const stop: RideStop = {
          id: `stop-${Date.now()}-${i}`,
          rideId: ride.id,
          location: {
            address: options.stops[i],
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180
          },
          isCompleted: false,
          position: i + 1
        };
        
        await db.insert('ride_stops', stop);
      }
      
      // Add stops to ride object for return
      ride.stops = options.stops.map((stop: string) => ({
        address: stop,
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
      }));
    }
    
    return ride;
  } catch (error) {
    console.error('Error booking ride:', error);
    throw new Error('Failed to book ride');
  }
};

// Get a single ride by ID
export const getRideById = async (rideId: string): Promise<Ride | null> => {
  try {
    const ride = await db.getById('rides', rideId) as Ride;
    
    if (!ride) {
      return null;
    }
    
    // Get the stops for this ride
    const stops = await db.query('ride_stops', { rideId }) as RideStop[];
    
    if (stops.length > 0) {
      ride.stops = stops
        .sort((a, b) => a.position - b.position)
        .map(stop => stop.location);
    }
    
    return ride;
  } catch (error) {
    console.error('Error fetching ride:', error);
    throw new Error('Failed to get ride');
  }
};

// Get all rides for a user
export const getUserRides = async (userId: string): Promise<Ride[]> => {
  try {
    return await db.query('rides', { userId }) as Ride[];
  } catch (error) {
    console.error('Error fetching user rides:', error);
    throw new Error('Failed to get user rides');
  }
};

// Update ride status
export const updateRideStatus = async (
  rideId: string, 
  status: Ride['status']
): Promise<Ride> => {
  try {
    const ride = await getRideById(rideId);
    
    if (!ride) {
      throw new Error('Ride not found');
    }
    
    const updatedRide = {
      ...ride,
      status,
      updatedAt: new Date()
    };
    
    await db.update('rides', rideId, updatedRide);
    return updatedRide;
  } catch (error) {
    console.error('Error updating ride status:', error);
    throw new Error('Failed to update ride status');
  }
};

// Start and stop ride update streams
export const startRideUpdates = (rideId: string, callback: (ride: Ride) => void) => {
  // This would normally use WebSockets or long polling
  // Here we just return an interval ID for simulating updates
  const intervalId = setInterval(async () => {
    try {
      const ride = await getRideById(rideId);
      if (ride) {
        callback(ride);
      }
    } catch (error) {
      console.error('Error in ride updates:', error);
    }
  }, 3000);
  
  return intervalId;
};

export const stopRideUpdates = (intervalId: number) => {
  clearInterval(intervalId);
};

// Rate a ride
export const rateRide = async (
  rideId: string, 
  rating: number, 
  isDriverRating: boolean = false
): Promise<Ride> => {
  try {
    const ride = await getRideById(rideId);
    
    if (!ride) {
      throw new Error('Ride not found');
    }
    
    const updatedRide = {
      ...ride,
      updatedAt: new Date(),
      isRated: true
    } as Ride;
    
    if (isDriverRating) {
      updatedRide.driverRating = rating;
    } else {
      updatedRide.userRating = rating;
    }
    
    await db.update('rides', rideId, updatedRide);
    return updatedRide;
  } catch (error) {
    console.error('Error rating ride:', error);
    throw new Error('Failed to rate ride');
  }
};

// Save a favorite route
export const saveFavoriteRoute = async (
  userId: string,
  name: string,
  startLocation: Location,
  endLocation: Location
): Promise<FavoriteRoute> => {
  try {
    const favoriteRoute: FavoriteRoute = {
      id: `favroute-${Date.now()}`,
      userId,
      name,
      startLocation,
      endLocation,
      createdAt: new Date()
    };
    
    await db.insert('favorite_routes', favoriteRoute);
    return favoriteRoute;
  } catch (error) {
    console.error('Error saving favorite route:', error);
    throw new Error('Failed to save favorite route');
  }
};

// Get all favorite routes for a user
export const getFavoriteRoutes = async (userId: string): Promise<FavoriteRoute[]> => {
  try {
    return await db.query('favorite_routes', { userId }) as FavoriteRoute[];
  } catch (error) {
    console.error('Error fetching favorite routes:', error);
    throw new Error('Failed to get favorite routes');
  }
};

// Delete a favorite route
export const deleteFavoriteRoute = async (id: string): Promise<boolean> => {
  try {
    return await db.delete('favorite_routes', id);
  } catch (error) {
    console.error('Error deleting favorite route:', error);
    throw new Error('Failed to delete favorite route');
  }
};

// Save a favorite driver
export const saveFavoriteDriver = async (
  userId: string,
  driverId: string
): Promise<FavoriteDriver> => {
  try {
    const favoriteDriver: FavoriteDriver = {
      id: `favdriver-${Date.now()}`,
      userId,
      driverId,
      createdAt: new Date()
    };
    
    await db.insert('favorite_drivers', favoriteDriver);
    return favoriteDriver;
  } catch (error) {
    console.error('Error saving favorite driver:', error);
    throw new Error('Failed to save favorite driver');
  }
};

// Get all favorite drivers for a user
export const getFavoriteDrivers = async (userId: string): Promise<FavoriteDriver[]> => {
  try {
    return await db.query('favorite_drivers', { userId }) as FavoriteDriver[];
  } catch (error) {
    console.error('Error fetching favorite drivers:', error);
    throw new Error('Failed to get favorite drivers');
  }
};

// Delete a favorite driver
export const deleteFavoriteDriver = async (id: string): Promise<boolean> => {
  try {
    return await db.delete('favorite_drivers', id);
  } catch (error) {
    console.error('Error deleting favorite driver:', error);
    throw new Error('Failed to delete favorite driver');
  }
};
