
import { toast } from "@/hooks/use-toast";

export type Ride = {
  id: string;
  userId: string;
  driverId?: string;
  startLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  endLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  paymentMethod?: 'cash' | 'card' | 'wallet';
  rideType: 'standard' | 'premium' | 'eco';
  driverRating?: number;
  userRating?: number;
  estimatedArrival?: Date;
};

// Mock database of rides
let rides: Ride[] = [];

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Calculate fare based on distance, duration and ride type
export const calculateFare = (
  distance: number, 
  duration: number, 
  rideType: 'standard' | 'premium' | 'eco'
): number => {
  const baseRate = rideType === 'premium' ? 3 : rideType === 'eco' ? 1.5 : 2;
  const distanceRate = rideType === 'premium' ? 2 : rideType === 'eco' ? 1 : 1.5;
  const durationRate = rideType === 'premium' ? 0.5 : rideType === 'eco' ? 0.2 : 0.3;
  
  return +(baseRate + (distance * distanceRate) + (duration * durationRate)).toFixed(2);
};

// Estimate arrival time (mocked)
export const estimateArrival = (): Date => {
  const now = new Date();
  // Random time between 5 and 15 minutes from now
  now.setMinutes(now.getMinutes() + 5 + Math.floor(Math.random() * 10));
  return now;
};

// Calculate estimated distance and duration between two locations (mocked)
export const calculateRoute = (
  startLocation: string,
  endLocation: string
): { distance: number; duration: number } => {
  // In a real app, this would call a maps API (Google Maps, Mapbox, etc)
  // For now, we'll return mock data based on the strings
  const mockDistance = (startLocation.length + endLocation.length) % 10 + 5; // 5-15 km
  const mockDuration = mockDistance * 3; // 3 minutes per km
  
  return {
    distance: mockDistance,
    duration: mockDuration
  };
};

// Book a new ride
export const bookRide = (
  userId: string,
  startLocation: string,
  endLocation: string,
  rideType: 'standard' | 'premium' | 'eco' = 'standard',
  paymentMethod: 'cash' | 'card' | 'wallet' = 'cash'
): Promise<Ride> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const { distance, duration } = calculateRoute(startLocation, endLocation);
      const fare = calculateFare(distance, duration, rideType);
      
      const newRide: Ride = {
        id: generateId(),
        userId,
        startLocation: {
          address: startLocation,
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        },
        endLocation: {
          address: endLocation,
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
        estimatedArrival: estimateArrival()
      };
      
      rides.push(newRide);
      
      // Simulate driver acceptance after a short delay
      setTimeout(() => {
        const rideToUpdate = rides.find(r => r.id === newRide.id);
        if (rideToUpdate && rideToUpdate.status === 'pending') {
          rideToUpdate.status = 'accepted';
          rideToUpdate.driverId = generateId();
          rideToUpdate.updatedAt = new Date();
          
          toast({
            title: "Driver Found!",
            description: "A driver has accepted your ride request.",
          });
        }
      }, 5000);
      
      resolve(newRide);
    }, 1500);
  });
};

// Get all rides for a user
export const getUserRides = (userId: string): Promise<Ride[]> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const userRides = rides.filter(ride => ride.userId === userId);
      resolve(userRides);
    }, 500);
  });
};

// Get a specific ride by ID
export const getRideById = (rideId: string): Promise<Ride | undefined> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const ride = rides.find(ride => ride.id === rideId);
      resolve(ride);
    }, 300);
  });
};

// Update ride status
export const updateRideStatus = (
  rideId: string, 
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled'
): Promise<Ride | undefined> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const rideIndex = rides.findIndex(ride => ride.id === rideId);
      if (rideIndex !== -1) {
        rides[rideIndex].status = status;
        rides[rideIndex].updatedAt = new Date();
        resolve(rides[rideIndex]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
};

// Rate a ride
export const rateRide = (
  rideId: string,
  rating: number,
  isDriver: boolean
): Promise<Ride | undefined> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const rideIndex = rides.findIndex(ride => ride.id === rideId);
      if (rideIndex !== -1) {
        if (isDriver) {
          rides[rideIndex].userRating = rating;
        } else {
          rides[rideIndex].driverRating = rating;
        }
        rides[rideIndex].updatedAt = new Date();
        resolve(rides[rideIndex]);
      } else {
        resolve(undefined);
      }
    }, 300);
  });
};

// Cancel a ride
export const cancelRide = (rideId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const rideIndex = rides.findIndex(ride => ride.id === rideId);
      if (rideIndex !== -1 && ['pending', 'accepted'].includes(rides[rideIndex].status)) {
        rides[rideIndex].status = 'cancelled';
        rides[rideIndex].updatedAt = new Date();
        resolve(true);
      } else {
        resolve(false);
      }
    }, 300);
  });
};

// Simulate ride progress updates (for ongoing rides)
export let rideUpdatesInterval: NodeJS.Timeout | null = null;

export const startRideUpdates = (
  rideId: string, 
  onUpdate: (position: { lat: number, lng: number }) => void
): void => {
  // Clear any existing interval
  if (rideUpdatesInterval) {
    clearInterval(rideUpdatesInterval);
  }
  
  // Find the ride
  const ride = rides.find(r => r.id === rideId);
  if (!ride) return;
  
  // Start position is the driver's current location (random for now)
  let currentLat = ride.startLocation.lat - 0.01;
  let currentLng = ride.startLocation.lng - 0.01;
  
  // End position
  const endLat = ride.endLocation.lat;
  const endLng = ride.endLocation.lng;
  
  // Calculate step size for smooth movement
  const steps = 20; // Total updates before arrival
  const latStep = (endLat - currentLat) / steps;
  const lngStep = (endLng - currentLng) / steps;
  
  let stepCount = 0;
  
  // Update every 3 seconds
  rideUpdatesInterval = setInterval(() => {
    // Move toward destination
    currentLat += latStep;
    currentLng += lngStep;
    stepCount++;
    
    // Provide update
    onUpdate({ lat: currentLat, lng: currentLng });
    
    // Update ride status when driver arrives at pickup
    if (stepCount === 5 && ride.status === 'accepted') {
      updateRideStatus(rideId, 'ongoing');
      toast({
        title: "Ride Started",
        description: "Your driver has arrived and the ride has begun.",
      });
    }
    
    // End updates when destination is reached
    if (stepCount >= steps) {
      if (rideUpdatesInterval) clearInterval(rideUpdatesInterval);
      updateRideStatus(rideId, 'completed');
      toast({
        title: "Ride Completed",
        description: "You have arrived at your destination.",
      });
    }
  }, 3000);
};

export const stopRideUpdates = (): void => {
  if (rideUpdatesInterval) {
    clearInterval(rideUpdatesInterval);
    rideUpdatesInterval = null;
  }
};
