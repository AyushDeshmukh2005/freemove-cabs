
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/negotiations';

export interface NegotiationRequest {
  rideId: string;
  userId: string;
  userOffer: number;
}

export interface CounterOfferResponse {
  negotiationId: string;
  response: 'accepted' | 'rejected' | 'countered';
  counterOffer?: number;
  driverId: string;
}

export interface Negotiation {
  id: string;
  rideId: string;
  userId: string;
  driverId?: string;
  userOffer: number;
  driverCounterOffer?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

// Create a new fare negotiation
export const negotiateRideFare = async (negotiation: NegotiationRequest) => {
  try {
    const response = await axios.post(API_URL, negotiation);
    return response.data;
  } catch (error) {
    console.error('Error negotiating ride fare:', error);
    throw error;
  }
};

// Get negotiations for a ride
export const getRideNegotiations = async (rideId: string) => {
  try {
    const response = await axios.get(`${API_URL}/ride/${rideId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ride negotiations:', error);
    throw error;
  }
};

// Driver responds to a negotiation
export const respondToNegotiation = async (
  negotiationId: string, 
  driverId: string,
  response: 'accepted' | 'rejected' | 'countered',
  counterOffer?: number
) => {
  try {
    const data = {
      driverId,
      response,
      counterOffer
    };
    
    const apiResponse = await axios.patch(`${API_URL}/${negotiationId}/respond`, data);
    return apiResponse.data;
  } catch (error) {
    console.error('Error responding to negotiation:', error);
    throw error;
  }
};

// Accept a counter offer from a driver
export const acceptCounterOffer = async (negotiationId: string) => {
  try {
    const response = await axios.patch(`${API_URL}/${negotiationId}/accept-counter`);
    return response.data;
  } catch (error) {
    console.error('Error accepting counter offer:', error);
    throw error;
  }
};

// Get negotiation by ID
export const getNegotiationById = async (id: string): Promise<Negotiation> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching negotiation:', error);
    throw new Error('Failed to fetch negotiation');
  }
};

// Create a new negotiation
export const createNegotiation = async (rideId: string, userId: string, userOffer: number): Promise<Negotiation> => {
  try {
    const response = await axios.post(API_URL, { rideId, userId, userOffer });
    return response.data.data;
  } catch (error) {
    console.error('Error creating negotiation:', error);
    throw new Error('Failed to create negotiation');
  }
};

// Make counter offer
export const makeCounterOffer = async (negotiationId: string, driverId: string, counterOffer: number): Promise<Negotiation> => {
  try {
    const response = await axios.patch(`${API_URL}/${negotiationId}/counter`, { 
      driverId, 
      counterOffer 
    });
    return response.data.data;
  } catch (error) {
    console.error('Error making counter offer:', error);
    throw new Error('Failed to make counter offer');
  }
};

export default {
  negotiateRideFare,
  getRideNegotiations,
  respondToNegotiation,
  acceptCounterOffer,
  getNegotiationById,
  createNegotiation,
  makeCounterOffer
};
