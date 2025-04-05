
import axios from 'axios';

// Define API_URL constant
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/rides';

// Fix the implementation of generateSplitPaymentLink to match the component usage
export const generateSplitPaymentLink = async (rideId: string): Promise<{link: string, amount: number}> => {
  try {
    const response = await axios.post(`${API_URL}/${rideId}/split-payment`);
    return response.data; // This should return {link: string, amount: number}
  } catch (error) {
    console.error('Error generating split payment link:', error);
    throw error;
  }
};

// Add required type definitions and functions
export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface RideStop {
  id?: string;
  address: string;
  isCompleted?: boolean;
  order?: number;
  rideId?: string;
}

export interface FavoriteRoute {
  id: string;
  name: string;
  startLocation: Location;
  endLocation: Location;
  userId: string;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  startLocation: Location;
  endLocation: Location;
  stops?: RideStop[];
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: number;
  rideType: 'standard' | 'premium' | 'eco';
  paymentMethod?: 'cash' | 'card' | 'wallet';
  createdAt: Date;
  updatedAt: Date;
  nearbyLandmark?: string;
  rideMood?: 'chatty' | 'quiet' | 'work' | 'music';
  userRating?: number;
  appliedDiscount?: number;
  weatherAdjustment?: number;
  isShared?: boolean;
  isNegotiable?: boolean;
  isRated?: boolean;
}

// Required service functions
export const getRideById = async (rideId: string): Promise<Ride> => {
  try {
    const response = await axios.get(`${API_URL}/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ride:', error);
    throw error;
  }
};

export const getUserRides = async (userId: string): Promise<Ride[]> => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user rides:', error);
    throw error;
  }
};

export const bookRide = async (
  userId: string,
  pickupLocation: string,
  destination: string,
  rideType: string,
  paymentMethod: string,
  options?: any,
  negotiatedFare?: number | null
): Promise<Ride> => {
  try {
    const response = await axios.post(API_URL, {
      userId,
      pickupLocation,
      destination,
      rideType,
      paymentMethod,
      options,
      negotiatedFare
    });
    return response.data;
  } catch (error) {
    console.error('Error booking ride:', error);
    throw error;
  }
};

export const cancelRide = async (rideId: string): Promise<Ride> => {
  try {
    const response = await axios.put(`${API_URL}/${rideId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling ride:', error);
    throw error;
  }
};

export const rateRide = async (rideId: string, rating: number, feedback: string): Promise<Ride> => {
  try {
    const response = await axios.post(`${API_URL}/${rideId}/rate`, { rating, feedback });
    return response.data;
  } catch (error) {
    console.error('Error rating ride:', error);
    throw error;
  }
};

export const calculateRoute = (
  origin: string,
  destination: string,
  waypoints?: string[]
): { distance: number; duration: number } => {
  // Mock implementation
  const distance = 5 + Math.random() * 10;
  const duration = distance * 2 + Math.random() * 10;
  
  return { distance, duration };
};

export const calculateFare = (
  distance: number,
  duration: number,
  rideType: string = 'standard',
  isShared: boolean = false,
  discount: number = 0,
  weatherCondition: string = 'clear'
): number => {
  // Base rate calculation
  let baseFare = 2.5;
  let perKm = 1.0;
  let perMinute = 0.2;
  
  // Adjust rates based on ride type
  if (rideType === 'premium') {
    baseFare = 5.0;
    perKm = 2.0;
    perMinute = 0.4;
  } else if (rideType === 'eco') {
    discount = Math.max(discount, 0.1); // Ensure at least 10% discount for eco rides
  }
  
  // Calculate fare
  let fare = baseFare + (distance * perKm) + (duration * perMinute);
  
  // Apply weather adjustment
  if (weatherCondition === 'rain' || weatherCondition === 'snow') {
    fare *= 1.2; // 20% surge for bad weather
  }
  
  // Apply discounts (eco, shared rides, etc)
  fare *= (1 - discount);
  
  // Apply shared ride discount
  if (isShared) {
    fare *= 0.7; // 30% off for shared rides
  }
  
  return parseFloat(fare.toFixed(2));
};

export const getFavoriteRoutes = async (userId: string): Promise<FavoriteRoute[]> => {
  try {
    const response = await axios.get(`${API_URL}/favorites/routes/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite routes:', error);
    return [];
  }
};

export const saveFavoriteRoute = async (
  userId: string,
  name: string,
  startLocation: Location,
  endLocation: Location
): Promise<FavoriteRoute> => {
  try {
    const response = await axios.post(`${API_URL}/favorites/routes`, {
      userId,
      name,
      startLocation,
      endLocation
    });
    return response.data;
  } catch (error) {
    console.error('Error saving favorite route:', error);
    throw error;
  }
};

export const deleteFavoriteRoute = async (routeId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/favorites/routes/${routeId}`);
    return true;
  } catch (error) {
    console.error('Error deleting favorite route:', error);
    return false;
  }
};

export const getFavoriteDrivers = async (userId: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_URL}/favorites/drivers/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite drivers:', error);
    return [];
  }
};

export const deleteFavoriteDriver = async (driverId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/favorites/drivers/${driverId}`);
    return true;
  } catch (error) {
    console.error('Error deleting favorite driver:', error);
    return false;
  }
};

export const addStopToRide = async (rideId: string, address: string): Promise<Ride> => {
  try {
    const response = await axios.post(`${API_URL}/${rideId}/stops`, { address });
    return response.data;
  } catch (error) {
    console.error('Error adding stop to ride:', error);
    throw error;
  }
};

export const changeRideDestination = async (rideId: string, newDestination: string): Promise<Ride> => {
  try {
    const response = await axios.put(`${API_URL}/${rideId}/destination`, { destination: newDestination });
    return response.data;
  } catch (error) {
    console.error('Error changing ride destination:', error);
    throw error;
  }
};
