
import axios from 'axios';
import { db } from '../../Database/database';

export type NegotiationRequest = {
  rideId: string;
  userId: string;
  userOffer: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  driverCounterOffer?: number;
};

export type Negotiation = {
  id: string;
  rideId: string;
  userId: string;
  userOffer: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  driverCounterOffer?: number;
  createdAt: Date;
  updatedAt: Date;
};

// Create a new fare negotiation
export const createNegotiation = async (
  rideId: string,
  userId: string,
  userOffer: number
): Promise<Negotiation> => {
  try {
    const negotiation: Negotiation = {
      id: `neg-${Date.now()}`,
      rideId,
      userId,
      userOffer,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.insert('negotiations', negotiation);
    return negotiation;
  } catch (error) {
    console.error('Error creating negotiation:', error);
    throw new Error('Failed to create negotiation');
  }
};

// Accept counter offer from driver
export const acceptCounterOffer = async (negotiationId: string): Promise<boolean> => {
  try {
    const negotiation = await db.getById('negotiations', negotiationId) as Negotiation;
    
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }
    
    const updatedNegotiation = {
      ...negotiation,
      status: 'accepted',
      updatedAt: new Date()
    };
    
    await db.update('negotiations', negotiationId, updatedNegotiation);
    return true;
  } catch (error) {
    console.error('Error accepting counter offer:', error);
    throw new Error('Failed to accept counter offer');
  }
};

// Make a counter offer (driver side)
export const makeCounterOffer = async (
  negotiationId: string,
  driverCounterOffer: number
): Promise<Negotiation> => {
  try {
    const negotiation = await db.getById('negotiations', negotiationId) as Negotiation;
    
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }
    
    const updatedNegotiation = {
      ...negotiation,
      status: 'countered',
      driverCounterOffer,
      updatedAt: new Date()
    } as Negotiation;
    
    await db.update('negotiations', negotiationId, updatedNegotiation);
    return updatedNegotiation;
  } catch (error) {
    console.error('Error making counter offer:', error);
    throw new Error('Failed to make counter offer');
  }
};

// Get negotiation by ID
export const getNegotiationById = async (negotiationId: string): Promise<Negotiation | null> => {
  try {
    return await db.getById('negotiations', negotiationId) as Negotiation;
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    throw new Error('Failed to get negotiation');
  }
};

// Get all negotiations for a ride
export const getRideNegotiations = async (rideId: string): Promise<Negotiation[]> => {
  try {
    return await db.query('negotiations', { rideId }) as Negotiation[];
  } catch (error) {
    console.error('Error fetching ride negotiations:', error);
    throw new Error('Failed to get ride negotiations');
  }
};

// Accept a negotiation (driver side)
export const acceptNegotiation = async (negotiationId: string): Promise<boolean> => {
  try {
    const negotiation = await db.getById('negotiations', negotiationId) as Negotiation;
    
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }
    
    const updatedNegotiation = {
      ...negotiation,
      status: 'accepted',
      updatedAt: new Date()
    };
    
    await db.update('negotiations', negotiationId, updatedNegotiation);
    return true;
  } catch (error) {
    console.error('Error accepting negotiation:', error);
    throw new Error('Failed to accept negotiation');
  }
};
