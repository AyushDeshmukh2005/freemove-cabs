
import axios from 'axios';
import { db } from '@database/databaseService';

export interface NegotiationRequest {
  rideId: string;
  userId: string;
  proposedFare: number;
  message?: string;
}

export interface Negotiation {
  id: string;
  rideId: string;
  userId: string;
  driverId: string;
  userOffer: number;
  driverCounterOffer?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

// Function to send a fare negotiation request
export const negotiateRideFare = async (
  rideId: string,
  userId: string,
  proposedFare: number,
  message?: string
): Promise<Negotiation> => {
  try {
    const response = await axios.post('/api/negotiations', {
      rideId,
      userId,
      proposedFare,
      message
    });
    return response.data.data;
  } catch (error) {
    console.error('Error negotiating fare:', error);
    throw new Error('Failed to submit negotiation request');
  }
};

// Get negotiation by ID
export const getNegotiationById = async (id: string): Promise<Negotiation> => {
  try {
    const response = await axios.get(`/api/negotiations/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    throw new Error('Failed to fetch negotiation');
  }
};

// Accept a negotiation
export const acceptNegotiation = async (negotiationId: string): Promise<Negotiation> => {
  try {
    const response = await axios.patch(`/api/negotiations/${negotiationId}/accept`);
    return response.data.data;
  } catch (error) {
    console.error('Error accepting negotiation:', error);
    throw new Error('Failed to accept negotiation');
  }
};

// Reject a negotiation
export const rejectNegotiation = async (negotiationId: string): Promise<Negotiation> => {
  try {
    const response = await axios.patch(`/api/negotiations/${negotiationId}/reject`);
    return response.data.data;
  } catch (error) {
    console.error('Error rejecting negotiation:', error);
    throw new Error('Failed to reject negotiation');
  }
};

// Make counter offer for a negotiation
export const makeCounterOffer = async (negotiationId: string, counterOffer: number): Promise<Negotiation> => {
  try {
    const response = await axios.patch(`/api/negotiations/${negotiationId}/counter`, {
      counterOffer
    });
    return response.data.data;
  } catch (error) {
    console.error('Error making counter offer:', error);
    throw new Error('Failed to submit counter offer');
  }
};

// Accept a counter offer
export const acceptCounterOffer = async (negotiationId: string): Promise<Negotiation> => {
  try {
    const response = await axios.patch(`/api/negotiations/${negotiationId}/accept-counter`);
    return response.data.data;
  } catch (error) {
    console.error('Error accepting counter offer:', error);
    throw new Error('Failed to accept counter offer');
  }
};

// Create a new negotiation
export const createNegotiation = async (data: NegotiationRequest): Promise<Negotiation> => {
  try {
    const response = await axios.post('/api/negotiations', data);
    return response.data.data;
  } catch (error) {
    console.error('Error creating negotiation:', error);
    throw new Error('Failed to create negotiation');
  }
};
