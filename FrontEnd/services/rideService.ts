
import axios from 'axios';
import { getWeatherAdjustment } from './weatherService';
import { db } from '@database/databaseService';

export interface RideLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface RideStop {
  id?: string;
  rideId?: string;
  address: string;
  lat: number;
  lng: number;
  isCompleted?: boolean;
  position: number;
}

export interface FavoriteRoute {
  id?: string;
  userId: string;
  name: string;
  startLocation: RideLocation;
  endLocation: RideLocation;
  createdAt?: Date;
}

export interface FavoriteDriver {
  id?: string;
  userId: string;
  driverId: string;
  name?: string;
  rating?: number;
  createdAt?: Date;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  startLocation: RideLocation;
  endLocation: RideLocation;
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
  isNegotiable: boolean;
  suggestedFare?: number;
  isRated: boolean;
  stops: RideStop[];
}

// Book a new ride
export const bookRide = async (
  userId: string, 
  startLocation: RideLocation, 
  endLocation: RideLocation,
  rideType: 'standard' | 'premium' | 'eco',
  paymentMethod: 'cash' | 'card' | 'wallet',
  isShared: boolean,
  stops?: RideLocation[],
  rideMood?: 'chatty' | 'quiet' | 'work' | 'music',
  nearbyLandmark?: string
): Promise<Ride> => {
  try {
    const response = await axios.post('/api/rides', {
      userId,
      startLocation,
      endLocation,
      rideType,
      paymentMethod,
      isShared,
      stops,
      rideMood,
      nearbyLandmark
    });
    return response.data.data;
  } catch (error) {
    console.error('Error booking ride:', error);
    throw new Error('Failed to book ride');
  }
};

// Calculate route between two locations
export const calculateRoute = async (
  startLocation: RideLocation, 
  endLocation: RideLocation
): Promise<{distance: number, duration: number}> => {
  try {
    // This would normally call a mapping API
    // Simulating with dummy data
    return {
      distance: 10.5, // km
      duration: 25 // minutes
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    throw new Error('Failed to calculate route');
  }
};

// Calculate ride fare
export const calculateRideFare = async (
  distance: number, 
  duration: number, 
  rideType: 'standard' | 'premium' | 'eco',
  isShared: boolean,
  weatherCondition?: string
): Promise<number> => {
  try {
    let baseFare = 5.0; // Base fare in dollars
    let perKmRate = 1.5; // Rate per kilometer
    let perMinuteRate = 0.3; // Rate per minute
    
    // Adjust rates based on ride type
    if (rideType === 'premium') {
      baseFare = 8.0;
      perKmRate = 2.5;
      perMinuteRate = 0.5;
    } else if (rideType === 'eco') {
      baseFare = 4.0;
      perKmRate = 1.2;
      perMinuteRate = 0.2;
    }
    
    // Calculate initial fare
    let fare = baseFare + (distance * perKmRate) + (duration * perMinuteRate);
    
    // Apply shared ride discount
    if (isShared) {
      fare = fare * 0.8; // 20% discount for shared rides
    }
    
    // Apply weather adjustment if condition provided
    if (weatherCondition) {
      const adjustment = await getWeatherAdjustment(weatherCondition);
      fare = fare * adjustment;
    }
    
    // Round to two decimal places
    return Math.round(fare * 100) / 100;
  } catch (error) {
    console.error('Error calculating fare:', error);
    throw new Error('Failed to calculate ride fare');
  }
};

// Get a ride by ID
export const getRideById = async (id: string): Promise<Ride> => {
  try {
    const response = await axios.get(`/api/rides/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching ride:', error);
    throw new Error('Failed to fetch ride details');
  }
};

// Get user rides
export const getUserRides = async (userId: string): Promise<Ride[]> => {
  try {
    const response = await axios.get(`/api/rides/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user rides:', error);
    throw new Error('Failed to fetch ride history');
  }
};

// Update ride status
export const updateRideStatus = async (
  rideId: string, 
  status: 'accepted' | 'in_progress' | 'completed' | 'cancelled'
): Promise<Ride> => {
  try {
    const response = await axios.patch(`/api/rides/${rideId}/status`, { status });
    return response.data.data;
  } catch (error) {
    console.error('Error updating ride status:', error);
    throw new Error('Failed to update ride status');
  }
};

// Rate a ride
export const rateRide = async (
  rideId: string, 
  rating: number, 
  isDriverRating: boolean
): Promise<Ride> => {
  try {
    const response = await axios.patch(`/api/rides/${rideId}/rate`, { 
      rating, 
      isDriverRating 
    });
    return response.data.data;
  } catch (error) {
    console.error('Error rating ride:', error);
    throw new Error('Failed to submit rating');
  }
};

// Cancel a ride
export const cancelRide = async (rideId: string, reason?: string): Promise<Ride> => {
  try {
    const response = await axios.patch(`/api/rides/${rideId}/cancel`, { reason });
    return response.data.data;
  } catch (error) {
    console.error('Error cancelling ride:', error);
    throw new Error('Failed to cancel ride');
  }
};

// Add stop to ride
export const addStopToRide = async (rideId: string, stop: RideLocation): Promise<Ride> => {
  try {
    const response = await axios.post(`/api/rides/${rideId}/stops`, { stop });
    return response.data.data;
  } catch (error) {
    console.error('Error adding stop:', error);
    throw new Error('Failed to add stop to ride');
  }
};

// Change ride destination
export const changeRideDestination = async (rideId: string, newDestination: RideLocation): Promise<Ride> => {
  try {
    const response = await axios.patch(`/api/rides/${rideId}/destination`, { destination: newDestination });
    return response.data.data;
  } catch (error) {
    console.error('Error changing destination:', error);
    throw new Error('Failed to change ride destination');
  }
};

// Generate split payment link
export const generateSplitPaymentLink = async (rideId: string, amount: number): Promise<string> => {
  try {
    const response = await axios.post(`/api/rides/${rideId}/split-payment`, { amount });
    return response.data.data.paymentLink;
  } catch (error) {
    console.error('Error generating split payment link:', error);
    throw new Error('Failed to generate payment link');
  }
};

// Apply ridesharing discount
export const applyRidesharingDiscount = async (rideId: string): Promise<Ride> => {
  try {
    const response = await axios.patch(`/api/rides/${rideId}/discount`);
    return response.data.data;
  } catch (error) {
    console.error('Error applying discount:', error);
    throw new Error('Failed to apply ridesharing discount');
  }
};

// Save favorite route
export const saveFavoriteRoute = async (route: Omit<FavoriteRoute, 'id' | 'createdAt'>): Promise<FavoriteRoute> => {
  try {
    const response = await axios.post('/api/favorites/routes', route);
    return response.data.data;
  } catch (error) {
    console.error('Error saving favorite route:', error);
    throw new Error('Failed to save favorite route');
  }
};

// Get favorite routes
export const getFavoriteRoutes = async (userId: string): Promise<FavoriteRoute[]> => {
  try {
    const response = await axios.get(`/api/favorites/routes/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching favorite routes:', error);
    throw new Error('Failed to fetch favorite routes');
  }
};

// Delete favorite route
export const deleteFavoriteRoute = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/favorites/routes/${id}`);
  } catch (error) {
    console.error('Error deleting favorite route:', error);
    throw new Error('Failed to delete favorite route');
  }
};

// Save favorite driver
export const saveFavoriteDriver = async (data: Omit<FavoriteDriver, 'id' | 'createdAt'>): Promise<FavoriteDriver> => {
  try {
    const response = await axios.post('/api/favorites/drivers', data);
    return response.data.data;
  } catch (error) {
    console.error('Error saving favorite driver:', error);
    throw new Error('Failed to save favorite driver');
  }
};

// Get favorite drivers
export const getFavoriteDrivers = async (userId: string): Promise<FavoriteDriver[]> => {
  try {
    const response = await axios.get(`/api/favorites/drivers/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching favorite drivers:', error);
    throw new Error('Failed to fetch favorite drivers');
  }
};

// Delete favorite driver
export const deleteFavoriteDriver = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/api/favorites/drivers/${id}`);
  } catch (error) {
    console.error('Error deleting favorite driver:', error);
    throw new Error('Failed to delete favorite driver');
  }
};

// Functions for ride tracking
export const startRideUpdates = (rideId: string, callback: (data: any) => void) => {
  // This would normally use websockets or polling
  // For this example, we'll use a simple interval
  const interval = setInterval(() => {
    getRideById(rideId)
      .then(ride => callback(ride))
      .catch(error => console.error('Error updating ride:', error));
  }, 5000);
  
  return interval;
};

export const stopRideUpdates = (intervalId: number) => {
  clearInterval(intervalId);
};
