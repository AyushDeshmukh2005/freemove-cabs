
import { Ride } from "./rideService";
import { toast } from "@/hooks/use-toast";

export type RideSuggestion = {
  id: string;
  originalRideId: string;
  matchedRideId: string | null;
  savingsPercentage: number; // 5-25% discount
  potentialMatches: {
    userId: string;
    startLocation: string;
    endLocation: string;
    timeWindow: number; // minutes of flexibility
  }[];
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
};

// Simulate AI processing
const analyzeRouteForSharing = (ride: Ride): RideSuggestion | null => {
  // In a real app, this would use ML algorithms to find matches
  // For this demo, we'll randomly decide whether to suggest ridesharing
  const shouldSuggest = Math.random() > 0.3; // 70% chance to suggest
  
  if (!shouldSuggest) return null;
  
  // Create a fake suggestion
  const savingsPercentage = Math.floor(5 + Math.random() * 20); // 5-25% savings
  
  // Create some potential matches
  const numMatches = Math.floor(1 + Math.random() * 3); // 1-3 potential matches
  const potentialMatches = Array.from({ length: numMatches }).map(() => ({
    userId: Math.random().toString(36).substring(2, 15),
    startLocation: `${ride.startLocation.address.split(',')[0]} area`,
    endLocation: `${ride.endLocation.address.split(',')[0]} area`,
    timeWindow: Math.floor(5 + Math.random() * 25) // 5-30 minutes flexibility
  }));
  
  return {
    id: Math.random().toString(36).substring(2, 15),
    originalRideId: ride.id,
    matchedRideId: null,
    savingsPercentage,
    potentialMatches,
    status: 'pending',
    createdAt: new Date()
  };
};

export const aiRidesharingService = {
  // Get ride sharing suggestions for a ride
  getSuggestionsForRide: (ride: Ride): Promise<RideSuggestion | null> => {
    return new Promise((resolve) => {
      // Simulate AI processing delay
      setTimeout(() => {
        const suggestion = analyzeRouteForSharing(ride);
        resolve(suggestion);
      }, 1500);
    });
  },
  
  // Accept a ride sharing suggestion
  acceptSuggestion: (suggestionId: string): Promise<{ updatedRide: Ride, discount: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would update the ride in the database
        // For this demo, we'll just simulate a response
        
        const discountPercent = Math.floor(5 + Math.random() * 20); // 5-25%
        
        toast({
          title: "Rideshare Accepted",
          description: `You'll save ${discountPercent}% on this ride by sharing. We'll match you with a compatible rider.`,
        });
        
        // Return a mock updated ride with the discount applied
        resolve({
          updatedRide: {
            // This would be the actual ride data in a real app
            id: Math.random().toString(36).substring(2, 15),
            status: 'pending',
            fare: 0,
            distance: 0,
            duration: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: "",
            startLocation: { address: "", lat: 0, lng: 0 },
            endLocation: { address: "", lat: 0, lng: 0 },
            rideType: "standard"
          },
          discount: discountPercent
        });
      }, 800);
    });
  },
  
  // Decline a ride sharing suggestion
  declineSuggestion: (suggestionId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        toast({
          title: "Rideshare Declined",
          description: "Your ride will continue as a private trip.",
        });
        
        resolve(true);
      }, 500);
    });
  }
};
