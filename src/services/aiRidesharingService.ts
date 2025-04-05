
import { calculateFare, Ride } from './rideService';

interface RideShareMatch {
  id: string;
  rideRequest: Ride;
  potentialMatches: Ride[];
  estimatedSavings: number;
}

interface RouteSimilarity {
  routeOverlapPercentage: number;
  detourMinutes: number;
}

/**
 * AI-powered ridesharing service to match compatible rides and calculate fare savings
 */
export const aiRidesharingService = {
  /**
   * Find potential rideshare matches for a given ride request
   * 
   * @param ride The requested ride
   * @param searchRadiusKm The radius to search for matches in km
   * @param maxDetourMinutes Maximum acceptable detour time in minutes
   * @returns RideShareMatch object with potential matches and savings
   */
  findPotentialMatches: async (
    ride: Ride,
    searchRadiusKm: number = 1.5,
    maxDetourMinutes: number = 10
  ): Promise<RideShareMatch> => {
    // This would typically call an ML-powered backend endpoint
    // For now, we'll simulate a response
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create some mock potential matches
    const potentialMatches = [
      createMockRide(ride, 0.8, 3),
      createMockRide(ride, 0.6, 6),
      createMockRide(ride, 0.9, 2),
    ].filter(match => {
      // Filter matches based on route similarity and detour time
      const similarity = calculateRouteSimilarity(ride, match);
      return (
        similarity.routeOverlapPercentage > 0.5 && 
        similarity.detourMinutes < maxDetourMinutes
      );
    });
    
    // Calculate estimated savings based on potential sharing
    const estimatedSavings = calculateEstimatedSavings(ride, potentialMatches);
    
    return {
      id: `match_${Math.random().toString(36).substr(2, 9)}`,
      rideRequest: ride,
      potentialMatches,
      estimatedSavings
    };
  },
  
  /**
   * Calculate most efficient route for combined rideshare
   */
  calculateOptimalRoute: (rides: Ride[]): { 
    optimizedStops: { address: string, lat: number, lng: number }[],
    totalDistance: number,
    totalDuration: number 
  } => {
    // This would use a complex routing algorithm in production
    // For now, we'll simulate a basic route combination
    
    const allStops: { address: string, lat: number, lng: number }[] = [];
    
    // Extract all unique stops from the rides
    rides.forEach(ride => {
      // Add pickup location if not already included
      if (!allStops.some(stop => stop.address === ride.startLocation.address)) {
        allStops.push(ride.startLocation);
      }
      
      // Add intermediate stops
      ride.stops?.forEach(stop => {
        if (!allStops.some(s => s.address === stop.address)) {
          allStops.push({
            address: stop.address,
            lat: Math.random() * 0.1 + 37.7,
            lng: Math.random() * 0.1 - 122.4
          });
        }
      });
      
      // Add destination if not already included
      if (!allStops.some(stop => stop.address === ride.endLocation.address)) {
        allStops.push(ride.endLocation);
      }
    });
    
    // In a real implementation, we would use a TSP algorithm here
    // For mock purposes, we'll just return the stops in the order they were added
    const totalDistance = allStops.length * 2.5;
    const totalDuration = totalDistance * 2;
    
    return {
      optimizedStops: allStops,
      totalDistance,
      totalDuration
    };
  },
  
  /**
   * Calculate fare split between shared ride passengers
   */
  calculateFareSplit: (rides: Ride[]): {
    originalTotal: number,
    discountedTotal: number,
    individualFares: { userId: string, originalFare: number, discountedFare: number }[]
  } => {
    // Calculate the original total fares (if rides were not shared)
    const originalFares = rides.map(ride => ({
      userId: ride.userId,
      fare: ride.fare
    }));
    
    const originalTotal = originalFares.reduce((sum, fare) => sum + fare.fare, 0);
    
    // Apply ridesharing discount (typically 20-30% off)
    const discountPercentage = 0.25;
    const discountedTotal = originalTotal * (1 - discountPercentage);
    
    // Calculate individual discounted fares proportional to original fares
    const individualFares = originalFares.map(fare => ({
      userId: fare.userId,
      originalFare: fare.fare,
      discountedFare: (fare.fare / originalTotal) * discountedTotal
    }));
    
    return {
      originalTotal,
      discountedTotal,
      individualFares
    };
  }
};

// Helper function to create a mock ride based on an existing ride
function createMockRide(
  baseRide: Ride, 
  routeSimilarity: number, 
  detourMinutes: number
): Ride {
  // Generate slightly different start/end locations based on similarity
  const startLocationVariance = 1 - routeSimilarity;
  const endLocationVariance = 1 - routeSimilarity;
  
  const mockRide: Ride = {
    id: `ride_${Math.random().toString(36).substr(2, 9)}`,
    userId: `user_${Math.random().toString(36).substr(2, 9)}`,
    startLocation: {
      address: `${Math.floor(Math.random() * 1000)} ${baseRide.startLocation.address.split(' ').slice(1).join(' ')}`,
      lat: baseRide.startLocation.lat + (Math.random() - 0.5) * startLocationVariance * 0.01,
      lng: baseRide.startLocation.lng + (Math.random() - 0.5) * startLocationVariance * 0.01
    },
    endLocation: {
      address: `${Math.floor(Math.random() * 1000)} ${baseRide.endLocation.address.split(' ').slice(1).join(' ')}`,
      lat: baseRide.endLocation.lat + (Math.random() - 0.5) * endLocationVariance * 0.01,
      lng: baseRide.endLocation.lng + (Math.random() - 0.5) * endLocationVariance * 0.01
    },
    status: 'pending',
    fare: baseRide.fare * (0.9 + Math.random() * 0.2), // Similar fare ±10%
    distance: baseRide.distance * (0.9 + Math.random() * 0.2), // Similar distance ±10%
    duration: baseRide.duration + detourMinutes, // Add detour minutes
    rideType: baseRide.rideType,
    paymentMethod: baseRide.paymentMethod,
    createdAt: new Date(),
    updatedAt: new Date(),
    isNegotiable: false,
    isRated: false,
    isShared: false,
    stops: []
  };
  
  return mockRide;
}

// Helper function to calculate route similarity between two rides
function calculateRouteSimilarity(ride1: Ride, ride2: Ride): RouteSimilarity {
  // In a real implementation, this would use geospatial calculations
  // For mock purposes, we'll simulate based on the mock ride creation
  
  // Calculate Euclidean distance between points as a simple approximation
  const startDistance = Math.sqrt(
    Math.pow(ride1.startLocation.lat - ride2.startLocation.lat, 2) +
    Math.pow(ride1.startLocation.lng - ride2.startLocation.lng, 2)
  );
  
  const endDistance = Math.sqrt(
    Math.pow(ride1.endLocation.lat - ride2.endLocation.lat, 2) +
    Math.pow(ride1.endLocation.lng - ride2.endLocation.lng, 2)
  );
  
  // Calculate overlap percentage based on distances
  const maxDistance = 0.01; // Max expected distance for our mocked data
  const startSimilarity = Math.max(0, 1 - startDistance / maxDistance);
  const endSimilarity = Math.max(0, 1 - endDistance / maxDistance);
  
  // Overall route similarity is the average of start and end similarities
  const routeOverlapPercentage = (startSimilarity + endSimilarity) / 2;
  
  // Detour minutes is proportional to distance difference
  const detourMinutes = Math.abs(ride1.duration - ride2.duration);
  
  return { routeOverlapPercentage, detourMinutes };
}

// Helper function to calculate estimated savings
function calculateEstimatedSavings(ride: Ride, matches: Ride[]): number {
  if (matches.length === 0) return 0;
  
  // A simple model - 10% discount per additional rider, up to 30%
  const discountPercentage = Math.min(matches.length * 0.1, 0.3);
  return ride.fare * discountPercentage;
}
