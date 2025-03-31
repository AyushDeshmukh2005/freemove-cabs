
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/negotiations';

export interface NegotiationRequest {
  rideId: number;
  userId: number;
  userOffer: number;
}

export interface CounterOfferResponse {
  negotiationId: number;
  response: 'accepted' | 'rejected' | 'countered';
  counterOffer?: number;
  driverId: string;
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
export const getRideNegotiations = async (rideId: number) => {
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
  negotiationId: number, 
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
export const acceptCounterOffer = async (negotiationId: number) => {
  try {
    const response = await axios.patch(`${API_URL}/${negotiationId}/accept-counter`);
    return response.data;
  } catch (error) {
    console.error('Error accepting counter offer:', error);
    throw error;
  }
};

export default {
  negotiateRideFare,
  getRideNegotiations,
  respondToNegotiation,
  acceptCounterOffer
};
