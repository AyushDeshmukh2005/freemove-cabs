
import { toast } from "@/hooks/use-toast";
import { databaseService } from "./databaseService";
import { themeService } from "./themeService";
import { aiRidesharingService } from "./aiRidesharingService";
import { driverRewardsService } from "./driverRewardsService";

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
  isShared?: boolean;
  appliedDiscount?: number;
};

// Mock database of rides (we'll use our database service now)
let rides: Ride[] = [];

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Calculate fare based on distance, duration and ride type
export const calculateFare = (
  distance: number, 
  duration: number, 
  rideType: 'standard' | 'premium' | 'eco',
  isShared: boolean = false,
  discountPercentage: number = 0
): number => {
  // Apply base pricing based on ride type
  const baseRate = rideType === 'premium' ? 3 : rideType === 'eco' ? 1.5 : 2;
  const distanceRate = rideType === 'premium' ? 2 : rideType === 'eco' ? 1 : 1.5;
  const durationRate = rideType === 'premium' ? 0.5 : rideType === 'eco' ? 0.2 : 0.3;
  
  // Calculate base fare
  let fare = baseRate + (distance * distanceRate) + (duration * durationRate);
  
  // Apply eco discount (additional 10% off for eco rides)
  if (rideType === 'eco') {
    fare = fare * 0.9; // 10% off for eco-friendly rides
  }
  
  // Apply shared ride discount
  if (isShared) {
    fare = fare * (1 - (discountPercentage / 100));
  }
  
  return +fare.toFixed(2);
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
  return new Promise(async (resolve) => {
    // Simulate API call
    setTimeout(async () => {
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
      
      // Add ride to database
      databaseService.add("rides", newRide.id, newRide);
      rides.push(newRide);
      
      // Check for ride sharing opportunities if not premium ride
      if (rideType !== 'premium') {
        setTimeout(async () => {
          const suggestion = await aiRidesharingService.getSuggestionsForRide(newRide);
          if (suggestion) {
            toast({
              title: "Rideshare Opportunity",
              description: `Share your ride and save ${suggestion.savingsPercentage}% on this trip.`,
            });
            
            // In a real app, this would show a UI prompt to accept/decline
            console.log("Rideshare suggestion available:", suggestion);
          }
        }, 2000);
      }
      
      // Simulate driver acceptance after a short delay
      setTimeout(() => {
        const rideToUpdate = rides.find(r => r.id === newRide.id);
        if (rideToUpdate && rideToUpdate.status === 'pending') {
          const driverId = generateId();
          rideToUpdate.status = 'accepted';
          rideToUpdate.driverId = driverId;
          rideToUpdate.updatedAt = new Date();
          
          // Update in database
          databaseService.update("rides", rideToUpdate.id, {
            status: 'accepted',
            driverId,
            updatedAt: new Date()
          });
          
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
    setTimeout(async () => {
      const rideIndex = rides.findIndex(ride => ride.id === rideId);
      if (rideIndex !== -1) {
        rides[rideIndex].status = status;
        rides[rideIndex].updatedAt = new Date();
        
        // Update in database
        databaseService.update("rides", rideId, {
          status,
          updatedAt: new Date()
        });
        
        // If ride completed, award driver points
        if (status === 'completed' && rides[rideIndex].driverId) {
          const driverId = rides[rideIndex].driverId as string;
          const ride = rides[rideIndex];
          
          try {
            const pointsAwarded = await driverRewardsService.addPointsForRide(
              driverId,
              ride.rideType,
              ride.driverRating,
              ride.distance
            );
            
            console.log(`Driver ${driverId} awarded ${pointsAwarded} points for ride ${rideId}`);
          } catch (error) {
            console.error("Failed to award driver points:", error);
          }
        }
        
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
          
          // If driver was rated well (4+), consider awarding achievements
          if (rating >= 4 && rides[rideIndex].driverId) {
            const driverId = rides[rideIndex].driverId;
            
            // For this demo, we'll randomly award achievements
            if (Math.random() > 0.7 && driverId) {  // 30% chance
              const achievementIds = ['first-ride', 'five-star', 'night-owl', 'eco-warrior'];
              const randomAchievement = achievementIds[Math.floor(Math.random() * achievementIds.length)];
              
              driverRewardsService.awardAchievement(driverId, randomAchievement);
            }
          }
        }
        
        rides[rideIndex].updatedAt = new Date();
        
        // Update in database
        databaseService.update("rides", rideId, {
          ...(isDriver ? { userRating: rating } : { driverRating: rating }),
          updatedAt: new Date()
        });
        
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
        
        // Update in database
        databaseService.update("rides", rideId, {
          status: 'cancelled',
          updatedAt: new Date()
        });
        
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

// Apply ridesharing discount to a ride
export const applyRidesharingDiscount = (
  rideId: string,
  discountPercentage: number
): Promise<Ride | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rideIndex = rides.findIndex(ride => ride.id === rideId);
      if (rideIndex === -1) {
        resolve(undefined);
        return;
      }
      
      const ride = rides[rideIndex];
      
      // Calculate new fare with discount
      const newFare = calculateFare(
        ride.distance,
        ride.duration,
        ride.rideType,
        true,
        discountPercentage
      );
      
      // Update ride
      rides[rideIndex] = {
        ...ride,
        fare: newFare,
        isShared: true,
        appliedDiscount: discountPercentage,
        updatedAt: new Date()
      };
      
      // Update in database
      databaseService.update("rides", rideId, {
        fare: newFare,
        isShared: true,
        appliedDiscount: discountPercentage,
        updatedAt: new Date()
      });
      
      resolve(rides[rideIndex]);
    }, 300);
  });
};
