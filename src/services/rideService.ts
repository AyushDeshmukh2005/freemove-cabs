import { db } from './databaseService';
import { getWeatherAdjustment } from './weatherService';

// Types
export type Ride = {
  id: string;
  userId: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  endTime: Date;
  fare: number;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  cabType: string;
  rating: number | null;
  review: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RideRequest = {
  userId: string;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  cabType: string;
};

/**
 * Book a ride
 */
export const bookRide = async (rideRequest: RideRequest): Promise<Ride> => {
  try {
    // Calculate ride fare
    const { startLocation, endLocation, startTime, cabType, userId } = rideRequest;
    const distance = 10; // Dummy distance
    const duration = 20; // Dummy duration
    const fare = await calculateRideFare(distance, duration, cabType);
    
    // Create ride record in database
    const ride = {
      id: `ride-${Date.now()}`,
      userId,
      driverId: 'driver-123', // Dummy driver ID
      startLocation,
      endLocation,
      startTime,
      endTime: new Date(startTime.getTime() + duration * 60000), // Dummy end time
      fare,
      status: 'pending',
      cabType,
      rating: null,
      review: null,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Ride;
    
    await db.insert('rides', ride);
    return ride;
  } catch (error) {
    console.error('Error booking ride:', error);
    throw new Error('Failed to book ride');
  }
};

/**
 * Get ride by ID
 */
export const getRideById = async (rideId: string): Promise<Ride | undefined> => {
  try {
    return await db.getById('rides', rideId) as Ride;
  } catch (error) {
    console.error('Error fetching ride:', error);
    throw new Error('Failed to get ride');
  }
};

/**
 * Get all rides for a user
 */
export const getUserRides = async (userId: string): Promise<Ride[]> => {
  try {
    return await db.query('rides', { userId }) as Ride[];
  } catch (error) {
    console.error('Error fetching user rides:', error);
    throw new Error('Failed to get user rides');
  }
};

/**
 * Update ride status
 */
export const updateRideStatus = async (rideId: string, status: Ride['status']): Promise<Ride> => {
  try {
    const ride = await db.getById('rides', rideId) as Ride;
    
    if (!ride) {
      throw new Error('Ride not found');
    }
    
    const updatedRide = {
      ...ride,
      status,
      updatedAt: new Date()
    } as Ride;
    
    await db.update('rides', rideId, updatedRide);
    return updatedRide;
  } catch (error) {
    console.error('Error updating ride status:', error);
    throw new Error('Failed to update ride status');
  }
};

/**
 * Rate a ride
 */
export const rateRide = async (rideId: string, rating: number, review: string): Promise<Ride> => {
  try {
    const ride = await db.getById('rides', rideId) as Ride;
    
    if (!ride) {
      throw new Error('Ride not found');
    }
    
    const updatedRide = {
      ...ride,
      rating,
      review,
      updatedAt: new Date()
    } as Ride;
    
    await db.update('rides', rideId, updatedRide);
    return updatedRide;
  } catch (error) {
    console.error('Error rating ride:', error);
    throw new Error('Failed to rate ride');
  }
};

/**
 * Cancel a ride
 */
export const cancelRide = async (rideId: string): Promise<Ride> => {
  try {
    const ride = await db.getById('rides', rideId) as Ride;
    
    if (!ride) {
      throw new Error('Ride not found');
    }
    
    const updatedRide = {
      ...ride,
      status: 'cancelled',
      updatedAt: new Date()
    } as Ride;
    
    await db.update('rides', rideId, updatedRide);
    return updatedRide;
  } catch (error) {
    console.error('Error cancelling ride:', error);
    throw new Error('Failed to cancel ride');
  }
};

/**
 * Calculate ride fare based on distance and other factors
 */
export const calculateRideFare = async (
  distance: number,
  duration: number,
  cabType: string,
  peakHours: boolean = false,
  weatherCondition: string = 'clear'
): Promise<number> => {
  // Base fare calculation
  let baseFare = 0;
  
  switch (cabType) {
    case 'economy':
      baseFare = 2.5 + (distance * 1.2) + (duration * 0.25);
      break;
    case 'premium':
      baseFare = 5 + (distance * 1.8) + (duration * 0.4);
      break;
    case 'luxury':
      baseFare = 10 + (distance * 2.5) + (duration * 0.6);
      break;
    default:
      baseFare = 2.5 + (distance * 1.2) + (duration * 0.25);
  }
  
  // Apply peak hours surcharge (25%)
  if (peakHours) {
    baseFare *= 1.25;
  }
  
  // Apply weather adjustment
  try {
    const weatherAdjustment = await getWeatherAdjustment(weatherCondition);
    baseFare = baseFare * (1 + weatherAdjustment);
  } catch (error) {
    console.error('Error getting weather adjustment:', error);
    // Continue without weather adjustment if there's an error
  }
  
  // Round to 2 decimal places
  return Math.round(baseFare * 100) / 100;
};

/**
 * Get weather-based fare adjustment factor
 */
export const getWeatherAdjustment = async (condition: string): Promise<number> => {
  // Default adjustment factors
  const adjustments: Record<string, number> = {
    'clear': 0,
    'cloudy': 0,
    'rain': 0.15,
    'snow': 0.25,
    'storm': 0.35,
    'fog': 0.20,
    'hail': 0.30
  };
  
  // If condition is not recognized, use 0 adjustment
  return adjustments[condition.toLowerCase()] || 0;
};

/**
 * Apply a ridesharing discount to the fare
 */
export const applyRidesharingDiscount = (fare: number, passengers: number): number => {
  // No discount for single passenger
  if (passengers <= 1) {
    return fare;
  }
  
  // 10% discount per additional passenger, up to 30%
  const discountFactor = Math.min(0.3, (passengers - 1) * 0.1);
  return fare * (1 - discountFactor);
};

/**
 * Add a stop to a ride
 */
export const addStopToRide = async (rideId: string, location: string): Promise<Ride> => {
  try {
    const ride = await db.getById('rides', rideId) as Ride;
    
    if (!ride) {
      throw new Error('Ride not found');
    }
    
    // Logic to add stop (not implemented)
    
    const updatedRide = {
      ...ride,
      updatedAt: new Date()
    } as Ride;
    
    await db.update('rides', rideId, updatedRide);
    return updatedRide;
  } catch (error) {
    console.error('Error adding stop to ride:', error);
    throw new Error('Failed to add stop to ride');
  }
};

/**
 * Change ride destination
 */
export const changeRideDestination = async (rideId: string, newDestination: string): Promise<Ride> => {
  try {
    const ride = await db.getById('rides', rideId) as Ride;
    
    if (!ride) {
      throw new Error('Ride not found');
    }
    
    const updatedRide = {
      ...ride,
      endLocation: newDestination,
      updatedAt: new Date()
    } as Ride;
    
    await db.update('rides', rideId, updatedRide);
    return updatedRide;
  } catch (error) {
    console.error('Error changing ride destination:', error);
    throw new Error('Failed to change ride destination');
  }
};

/**
 * Generate split payment link
 */
export const generateSplitPaymentLink = async (rideId: string): Promise<string> => {
  // Dummy implementation
  return `https://example.com/split-payment/${rideId}`;
};

/**
 * Save a route as favorite
 */
export const saveFavoriteRoute = async (
  userId: string,
  startLocation: string,
  endLocation: string,
  name: string
): Promise<any> => {
  try {
    const favoriteRoute = {
      id: `favroute-${Date.now()}`,
      userId,
      startLocation,
      endLocation,
      name,
      createdAt: new Date()
    };
    
    await db.insert('favoriteRoutes', favoriteRoute);
    return favoriteRoute;
  } catch (error) {
    console.error('Error saving favorite route:', error);
    throw new Error('Failed to save favorite route');
  }
};

/**
 * Get user's favorite routes
 */
export const getFavoriteRoutes = async (userId: string): Promise<any[]> => {
  try {
    return await db.query('favoriteRoutes', { userId });
  } catch (error) {
    console.error('Error fetching favorite routes:', error);
    throw new Error('Failed to get favorite routes');
  }
};

/**
 * Save a driver as favorite
 */
export const saveFavoriteDriver = async (
  userId: string,
  driverId: string,
  note?: string
): Promise<any> => {
  try {
    const favoriteDriver = {
      id: `favdriver-${Date.now()}`,
      userId,
      driverId,
      note: note || '',
      createdAt: new Date()
    };
    
    await db.insert('favoriteDrivers', favoriteDriver);
    return favoriteDriver;
  } catch (error) {
    console.error('Error saving favorite driver:', error);
    throw new Error('Failed to save favorite driver');
  }
};

/**
 * Get user's favorite drivers
 */
export const getFavoriteDrivers = async (userId: string): Promise<any[]> => {
  try {
    return await db.query('favoriteDrivers', { userId });
  } catch (error) {
    console.error('Error fetching favorite drivers:', error);
    throw new Error('Failed to get favorite drivers');
  }
};
