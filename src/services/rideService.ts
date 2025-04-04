
import axios from 'axios';
import { weatherService } from '@/services/weatherService';

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
  id: string;
  userId: string;
  name: string;
  startLocation: RideLocation;
  endLocation: RideLocation;
  createdAt?: Date;
}

export interface FavoriteDriver {
  id: string;
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

export type RideRequest = {
  userId: string;
  startLocation: string;
  endLocation: string;
  startTime: Date;
  cabType: string;
};

// Book a new ride
export const bookRide = async (
  userId: string,
  pickupLocation: string,
  destination: string,
  rideType: 'standard' | 'premium' | 'eco',
  paymentMethod: 'cash' | 'card' | 'wallet',
  options?: any,
  fareOverride?: number
): Promise<Ride> => {
  try {
    const response = await axios.post('/api/rides', {
      userId,
      pickupLocation,
      destination,
      rideType,
      paymentMethod,
      options,
      fareOverride
    });
    return response.data.data;
  } catch (error) {
    console.error('Error booking ride:', error);
    throw new Error('Failed to book ride');
  }
};

// Calculate route between two locations
export const calculateRoute = (
  pickupLocation: string,
  destination: string,
  stops: string[] = []
): { distance: number, duration: number } => {
  // This would normally call a mapping API
  // Simulating with dummy data
  const baseDistance = 10.5; // km
  const baseDuration = 25; // minutes
  
  // Add distance and time for additional stops
  const extraDistance = stops.length * 1.5;
  const extraDuration = stops.length * 5;
  
  return {
    distance: baseDistance + extraDistance,
    duration: baseDuration + extraDuration
  };
};

// Calculate ride fare
export const calculateFare = (
  distance: number,
  duration: number,
  rideType: 'standard' | 'premium' | 'eco' = 'standard',
  isShared: boolean = false,
  appliedDiscount: number = 0,
  weatherCondition?: string
): number => {
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
  
  // Apply eco discount
  if (rideType === 'eco') {
    fare = fare * 0.9; // 10% discount for eco-friendly rides
  }
  
  // Apply custom discount if any
  if (appliedDiscount > 0) {
    fare = fare * (1 - (appliedDiscount / 100));
  }
  
  // Apply weather adjustment if condition provided
  if (weatherCondition) {
    const adjustment = weatherService.getPriceAdjustmentForWeather(weatherCondition);
    fare = fare * (1 + adjustment);
  }
  
  // Round to two decimal places
  return Math.round(fare * 100) / 100;
};

// Alias for backward compatibility
export const calculateRideFare = calculateFare;

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
  review: string | boolean
): Promise<Ride> => {
  try {
    const response = await axios.patch(`/api/rides/${rideId}/rate`, { 
      rating,
      review
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
export const addStopToRide = async (rideId: string, stopAddress: string): Promise<Ride> => {
  try {
    const response = await axios.post(`/api/rides/${rideId}/stops`, { address: stopAddress });
    return response.data.data;
  } catch (error) {
    console.error('Error adding stop:', error);
    throw new Error('Failed to add stop to ride');
  }
};

// Change ride destination
export const changeRideDestination = async (rideId: string, newDestination: string): Promise<Ride> => {
  try {
    const response = await axios.patch(`/api/rides/${rideId}/destination`, { destination: newDestination });
    return response.data.data;
  } catch (error) {
    console.error('Error changing destination:', error);
    throw new Error('Failed to change ride destination');
  }
};

// Generate split payment link
export const generateSplitPaymentLink = async (rideId: string): Promise<string> => {
  try {
    const response = await axios.post(`/api/rides/${rideId}/split-payment`);
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
export const saveFavoriteRoute = async (
  userId: string,
  name: string,
  startLocation: RideLocation,
  endLocation: RideLocation
): Promise<FavoriteRoute> => {
  try {
    const response = await axios.post('/api/favorites/routes', {
      userId,
      name,
      startLocation,
      endLocation
    });
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
export const saveFavoriteDriver = async (
  userId: string,
  driverId: string,
  name?: string,
  rating?: number
): Promise<FavoriteDriver> => {
  try {
    const response = await axios.post('/api/favorites/drivers', {
      userId,
      driverId,
      name,
      rating
    });
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
export const startRideUpdates = (rideId: string, callback: (position: any, currentStop?: any) => void) => {
  // This would normally use websockets or polling
  // For this example, we'll use a simple interval
  const interval = setInterval(() => {
    getRideById(rideId)
      .then(ride => {
        // Simulate position updates
        const position = {
          lat: Math.random() * 0.01 + 37.7749,
          lng: Math.random() * 0.01 - 122.4194
        };
        callback(position);
      })
      .catch(error => console.error('Error updating ride:', error));
  }, 5000);
  
  return interval;
};

export const stopRideUpdates = (intervalId: number | NodeJS.Timeout) => {
  clearInterval(intervalId as number);
};
