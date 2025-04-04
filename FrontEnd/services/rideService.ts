
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface Ride {
  id: string;
  userId: string;
  driverId?: string;
  startLocation: Location;
  endLocation: Location;
  stops?: Location[];
  status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
  rideType: 'standard' | 'premium' | 'eco';
  paymentMethod: 'cash' | 'card' | 'wallet';
  fare: number;
  distance: number;
  duration: number;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  isNegotiable: boolean;
  isRated: boolean;
}

export interface FavoriteRoute {
  id: string;
  userId: string;
  name: string;
  startLocation: Location;
  endLocation: Location;
  createdAt: Date;
  useCount: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: {
    model: string;
    color: string;
    plateNumber: string;
    type: 'car' | 'bike' | 'auto';
  };
  photo: string;
  isOnline: boolean;
  lastLocation?: Location;
}

// Book a new ride
export const bookRide = async (
  userId: string,
  pickupLocation: string,
  destination: string,
  rideType: 'standard' | 'premium' | 'eco',
  paymentMethod: 'cash' | 'card' | 'wallet',
  options: any = {},
  negotiatedFare: number | null = null
): Promise<Ride> => {
  try {
    // Mock geolocation data - in a real app, this would come from a geocoding service
    const startLocation = {
      address: pickupLocation,
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    };
    
    const endLocation = {
      address: destination,
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    };
    
    // Calculate route to get distance and duration
    const { distance, duration } = calculateRoute(pickupLocation, destination, options.stops || []);
    
    // Calculate fare based on distance, duration, and ride type
    const fare = negotiatedFare || calculateFare(distance, duration, rideType);
    
    const ride = {
      id: `ride-${Date.now()}`,
      userId,
      startLocation,
      endLocation,
      stops: options.stops ? options.stops.map((stop: string) => ({
        address: stop,
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180
      })) : [],
      status: 'pending',
      rideType,
      paymentMethod,
      fare,
      distance,
      duration,
      createdAt: new Date(),
      updatedAt: new Date(),
      isShared: options.isShared || false,
      isNegotiable: options.isNegotiable || false,
      isRated: false,
      ...(options.rideMood && { rideMood: options.rideMood }),
      ...(options.favoritedDriverId && { requestedDriverId: options.favoritedDriverId })
    };
    
    // In a real app, save this to the backend
    // For now, just return the mocked ride
    return ride as Ride;
  } catch (error) {
    console.error('Error booking ride:', error);
    throw error;
  }
};

// Calculate route between two points
export const calculateRoute = (
  pickupLocation: string,
  destination: string,
  stops: string[] = []
) => {
  // Mock route calculation - in a real app, this would use a mapping API
  // Base distance/duration
  let distance = Math.random() * 10 + 2; // 2-12 km
  let duration = distance * 3 * 60; // Avg 20km/h in city traffic, in seconds
  
  // Add distance/duration for each stop
  if (stops.length > 0) {
    const stopDistances = stops.map(() => Math.random() * 2 + 0.5); // 0.5-2.5 km per stop
    const additionalDistance = stopDistances.reduce((sum, dist) => sum + dist, 0);
    distance += additionalDistance;
    duration += additionalDistance * 3 * 60; // Same speed assumption
  }
  
  return {
    distance, // in km
    duration // in seconds
  };
};

// Calculate fare based on distance, duration, and ride type
export const calculateFare = (
  distance: number,
  duration: number,
  rideType: 'standard' | 'premium' | 'eco',
  applyPromo: boolean = false,
  promoDiscount: number = 0,
  weatherCondition: string = 'clear'
) => {
  // Base rates
  const baseRate = 40; // Base fare in rupees
  const perKmRate = rideType === 'premium' ? 15 : (rideType === 'eco' ? 10 : 12);
  const perMinuteRate = rideType === 'premium' ? 2 : 1;
  
  // Calculate raw fare
  let fare = baseRate + (distance * perKmRate) + ((duration / 60) * perMinuteRate);
  
  // Apply ride type specific discounts/premiums
  if (rideType === 'eco') {
    fare *= 0.9; // 10% discount for eco rides
  } else if (rideType === 'premium') {
    fare *= 1.2; // 20% premium for premium rides
  }
  
  // Apply weather adjustments
  if (weatherCondition === 'rain' || weatherCondition === 'snow') {
    fare *= 1.15; // 15% surge for bad weather
  } else if (weatherCondition === 'storm') {
    fare *= 1.25; // 25% surge for severe weather
  }
  
  // Apply promo discount if applicable
  if (applyPromo && promoDiscount > 0) {
    fare *= (1 - promoDiscount / 100);
  }
  
  // Round to nearest integer
  return Math.round(fare);
};

// Get a user's ride history
export const getUserRideHistory = async (userId: string, page: number = 1, limit: number = 10): Promise<Ride[]> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock ride history - in a real app, this would come from the backend
    const mockRideHistory: Ride[] = Array.from({length: 20}, (_, i) => {
      const isCompleted = Math.random() > 0.2;
      const isCancelled = !isCompleted && Math.random() > 0.5;
      const isInProgress = !isCompleted && !isCancelled && Math.random() > 0.5;
      const isPending = !isCompleted && !isCancelled && !isInProgress;
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      
      const status: Ride['status'] = isCompleted ? 'completed' : 
                                    isCancelled ? 'cancelled' :
                                    isInProgress ? 'inProgress' : 'pending';
      
      const rideTypes: Ride['rideType'][] = ['standard', 'premium', 'eco'];
      const paymentMethods: Ride['paymentMethod'][] = ['cash', 'card', 'wallet'];
      
      return {
        id: `ride-${Date.now() - i * 86400000}`,
        userId,
        driverId: isCompleted || isInProgress ? `driver-${i}` : undefined,
        startLocation: {
          address: `Start Location ${i}`,
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        },
        endLocation: {
          address: `End Location ${i}`,
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        },
        stops: Math.random() > 0.7 ? [
          {
            address: `Stop ${i}`,
            lat: Math.random() * 180 - 90,
            lng: Math.random() * 360 - 180
          }
        ] : [],
        status,
        rideType: rideTypes[i % rideTypes.length],
        paymentMethod: paymentMethods[i % paymentMethods.length],
        fare: Math.floor(Math.random() * 500) + 100,
        distance: Math.random() * 15 + 1,
        duration: (Math.random() * 30 + 10) * 60, // 10-40 minutes in seconds
        rating: isCompleted ? Math.floor(Math.random() * 5) + 1 : undefined,
        feedback: isCompleted && Math.random() > 0.7 ? "Good ride!" : undefined,
        createdAt: startDate,
        updatedAt: new Date(),
        isShared: Math.random() > 0.8,
        isNegotiable: Math.random() > 0.7,
        isRated: isCompleted && Math.random() > 0.5
      };
    });
    
    // Sort by date (newest first)
    mockRideHistory.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return mockRideHistory.slice(startIndex, endIndex);
  } catch (error) {
    console.error('Error getting ride history:', error);
    throw error;
  }
};

// Get details of a specific ride
export const getRideDetails = async (rideId: string): Promise<Ride> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock ride details - in a real app, this would come from the backend
    const mockRide: Ride = {
      id: rideId,
      userId: "user-123",
      driverId: "driver-456",
      startLocation: {
        address: "123 Main St, Anytown",
        lat: 37.7749,
        lng: -122.4194
      },
      endLocation: {
        address: "456 Market St, Anytown",
        lat: 37.7922,
        lng: -122.4068
      },
      stops: [],
      status: 'inProgress',
      rideType: 'standard',
      paymentMethod: 'card',
      fare: 250,
      distance: 5.2,
      duration: 18 * 60, // 18 minutes in seconds
      createdAt: new Date(),
      updatedAt: new Date(),
      isShared: false,
      isNegotiable: false,
      isRated: false
    };
    
    return mockRide;
  } catch (error) {
    console.error('Error getting ride details:', error);
    throw error;
  }
};

// Save a route as favorite
export const saveFavoriteRoute = async (
  userId: string,
  name: string,
  startLocation: Location,
  endLocation: Location
): Promise<FavoriteRoute> => {
  try {
    // In a real app, this would call the backend API
    const favoriteRoute: FavoriteRoute = {
      id: `fav-${Date.now()}`,
      userId,
      name,
      startLocation,
      endLocation,
      createdAt: new Date(),
      useCount: 0
    };
    
    // Store in local storage for now
    const favoritesKey = `favorite_routes_${userId}`;
    const existingFavorites = localStorage.getItem(favoritesKey);
    const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
    favorites.push(favoriteRoute);
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    
    return favoriteRoute;
  } catch (error) {
    console.error('Error saving favorite route:', error);
    throw error;
  }
};

// Get favorite routes for a user
export const getFavoriteRoutes = async (userId: string): Promise<FavoriteRoute[]> => {
  try {
    // In a real app, this would call the backend API
    const favoritesKey = `favorite_routes_${userId}`;
    const existingFavorites = localStorage.getItem(favoritesKey);
    const favorites = existingFavorites ? JSON.parse(existingFavorites) : [];
    
    return favorites;
  } catch (error) {
    console.error('Error getting favorite routes:', error);
    throw error;
  }
};

// Delete a favorite route
export const deleteFavoriteRoute = async (userId: string, routeId: string): Promise<boolean> => {
  try {
    // In a real app, this would call the backend API
    const favoritesKey = `favorite_routes_${userId}`;
    const existingFavorites = localStorage.getItem(favoritesKey);
    
    if (!existingFavorites) {
      return false;
    }
    
    const favorites = JSON.parse(existingFavorites);
    const updatedFavorites = favorites.filter((route: FavoriteRoute) => route.id !== routeId);
    localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
    
    return true;
  } catch (error) {
    console.error('Error deleting favorite route:', error);
    throw error;
  }
};

// Generate a payment link for splitting fare
export const generateSplitPaymentLink = async (rideId: string): Promise<string> => {
  try {
    // In a real app, this would call the backend API to generate a unique payment link
    // For now, we'll just create a mock link
    await new Promise(resolve => setTimeout(resolve, 500)); // simulate API delay
    const mockLink = `https://gocabs.pay/split/${rideId}/${Date.now()}`;
    
    return mockLink;
  } catch (error) {
    console.error('Error generating split payment link:', error);
    throw error;
  }
};

// Get a count of completed rides for a user
export const getCompletedRidesCount = async (userId: string): Promise<number> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock data - in a real app, this would come from the backend
    return Math.floor(Math.random() * 50) + 5; // 5-55 rides
  } catch (error) {
    console.error('Error getting completed rides count:', error);
    return 0; // Return 0 on error
  }
};

// Create proper exports
export default {
  bookRide,
  calculateRoute,
  calculateFare,
  getUserRideHistory,
  getRideDetails,
  saveFavoriteRoute,
  getFavoriteRoutes,
  deleteFavoriteRoute,
  generateSplitPaymentLink,
  getCompletedRidesCount
};
