
import { toast } from "@/hooks/use-toast";

export type NegotiationRequest = {
  id: string;
  rideId: string;
  userId: string;
  driverId?: string;
  userOffer: number;
  driverCounterOffer?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
};

// Mock negotiation ID counter
let nextNegotiationId = 1;

// Mock negotiations data store
let negotiations: NegotiationRequest[] = [];

// Create a new negotiation request
export const createNegotiation = async (
  rideId: string,
  userId: string,
  userOffer: number
): Promise<NegotiationRequest> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 60000); // 30 minutes expiry
      
      const negotiation: NegotiationRequest = {
        id: `nego_${nextNegotiationId++}`,
        rideId,
        userId,
        userOffer,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        expiresAt
      };
      
      negotiations.push(negotiation);
      
      // Simulate driver responses (for demo)
      setTimeout(() => {
        // Find the negotiation
        const nego = negotiations.find(n => n.id === negotiation.id);
        if (!nego || nego.status !== 'pending') return;
        
        // Randomly accept, reject, or counter the offer
        const rand = Math.random();
        if (rand < 0.3) {
          // Accept offer
          nego.status = 'accepted';
          nego.driverId = `driver_${Math.floor(Math.random() * 1000)}`;
          nego.updatedAt = new Date();
          
          toast({
            title: "Offer Accepted!",
            description: "A driver has accepted your fare offer.",
          });
        } else if (rand < 0.6) {
          // Reject offer
          nego.status = 'rejected';
          nego.updatedAt = new Date();
          
          toast({
            title: "Offer Rejected",
            description: "Your fare offer was not accepted by any drivers.",
            variant: "destructive",
          });
        } else {
          // Counter offer
          nego.status = 'countered';
          nego.driverId = `driver_${Math.floor(Math.random() * 1000)}`;
          nego.driverCounterOffer = Math.round((userOffer * (1 + (Math.random() * 0.3))) * 2) / 2; // Up to 30% higher, rounded to nearest 0.5
          nego.updatedAt = new Date();
          
          toast({
            title: "Counter Offer Received",
            description: `A driver is willing to take you for $${nego.driverCounterOffer.toFixed(2)}`,
          });
        }
      }, 5000 + Math.random() * 10000); // Random response time between 5-15 seconds
      
      resolve(negotiation);
    }, 1000);
  });
};

// Get negotiations for a ride
export const getRideNegotiations = async (rideId: string): Promise<NegotiationRequest[]> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const rideNegotiations = negotiations.filter(n => n.rideId === rideId);
      resolve(rideNegotiations);
    }, 500);
  });
};

// Get a negotiation by ID
export const getNegotiationById = async (id: string): Promise<NegotiationRequest | undefined> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const negotiation = negotiations.find(n => n.id === id);
      resolve(negotiation);
    }, 500);
  });
};

// Accept a counter offer
export const acceptCounterOffer = async (negotiationId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const negotiation = negotiations.find(n => n.id === negotiationId);
      
      if (!negotiation || negotiation.status !== 'countered' || !negotiation.driverCounterOffer) {
        resolve(false);
        return;
      }
      
      negotiation.status = 'accepted';
      negotiation.updatedAt = new Date();
      
      resolve(true);
    }, 1000);
  });
};

// Make a counter offer
export const makeCounterOffer = async (
  negotiationId: string,
  counterOffer: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    // Simulate API call
    setTimeout(() => {
      const negotiation = negotiations.find(n => n.id === negotiationId);
      
      if (!negotiation) {
        resolve(false);
        return;
      }
      
      // Create a new negotiation with this counter offer
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 30 * 60000);
      
      const newNegotiation: NegotiationRequest = {
        id: `nego_${nextNegotiationId++}`,
        rideId: negotiation.rideId,
        userId: negotiation.userId,
        userOffer: counterOffer,
        status: 'pending',
        createdAt: now,
        updatedAt: now,
        expiresAt
      };
      
      negotiations.push(newNegotiation);
      
      // Simulate driver response for this counter offer
      setTimeout(() => {
        // Find the negotiation
        const nego = negotiations.find(n => n.id === newNegotiation.id);
        if (!nego || nego.status !== 'pending') return;
        
        // Randomly accept or reject the counter offer
        if (Math.random() < 0.6) {
          // Accept offer
          nego.status = 'accepted';
          nego.driverId = negotiation.driverId; // Same driver
          nego.updatedAt = new Date();
          
          toast({
            title: "Counter Offer Accepted!",
            description: "The driver has accepted your counter offer.",
          });
        } else {
          // Reject offer
          nego.status = 'rejected';
          nego.updatedAt = new Date();
          
          toast({
            title: "Counter Offer Rejected",
            description: "Your counter offer was rejected by the driver.",
            variant: "destructive",
          });
        }
      }, 3000 + Math.random() * 5000);
      
      resolve(true);
    }, 1000);
  });
};
