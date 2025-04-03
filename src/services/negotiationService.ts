
import { db } from './databaseService';

// Types
export type NegotiationRequest = {
  rideId: string;
  userId: string;
  proposedFare: number;
  message: string;
};

export type Negotiation = {
  id: string;
  rideId: string;
  userId: string;
  proposedFare: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  counterOffer: number | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Create a negotiation request for a ride fare
 */
export const negotiateRideFare = async (
  rideId: string,
  userId: string,
  proposedFare: number,
  message: string
): Promise<Negotiation> => {
  try {
    // Create negotiation record in database
    const negotiation = {
      id: `neg-${Date.now()}`,
      rideId,
      userId,
      proposedFare,
      message,
      status: 'pending',
      counterOffer: null,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Negotiation;
    
    // Store in database
    await db.insert('negotiations', negotiation);
    
    return negotiation;
  } catch (error) {
    console.error('Error negotiating ride fare:', error);
    throw new Error('Failed to create negotiation request');
  }
};

/**
 * Accept a negotiation request
 */
export const acceptNegotiation = async (negotiationId: string): Promise<Negotiation> => {
  try {
    const negotiation = await db.getById('negotiations', negotiationId) as Negotiation;
    
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }
    
    const updatedNegotiation = {
      ...negotiation,
      status: 'accepted',
      updatedAt: new Date()
    } as Negotiation;
    
    await db.update('negotiations', negotiationId, updatedNegotiation);
    
    return updatedNegotiation;
  } catch (error) {
    console.error('Error accepting negotiation:', error);
    throw new Error('Failed to accept negotiation');
  }
};

/**
 * Reject a negotiation with optional counter offer
 */
export const rejectNegotiation = async (
  negotiationId: string,
  counterOffer?: number
): Promise<Negotiation> => {
  try {
    const negotiation = await db.getById('negotiations', negotiationId) as Negotiation;
    
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }
    
    const updatedNegotiation = {
      ...negotiation,
      status: 'rejected',
      counterOffer: counterOffer || null,
      updatedAt: new Date()
    } as Negotiation;
    
    await db.update('negotiations', negotiationId, updatedNegotiation);
    
    return updatedNegotiation;
  } catch (error) {
    console.error('Error rejecting negotiation:', error);
    throw new Error('Failed to reject negotiation');
  }
};

/**
 * Get all negotiations for a ride
 */
export const getRideNegotiations = async (rideId: string): Promise<Negotiation[]> => {
  try {
    return await db.query('negotiations', { rideId }) as Negotiation[];
  } catch (error) {
    console.error('Error fetching ride negotiations:', error);
    throw new Error('Failed to get ride negotiations');
  }
};

/**
 * Get all negotiations made by a user
 */
export const getUserNegotiations = async (userId: string): Promise<Negotiation[]> => {
  try {
    return await db.query('negotiations', { userId }) as Negotiation[];
  } catch (error) {
    console.error('Error fetching user negotiations:', error);
    throw new Error('Failed to get user negotiations');
  }
};
