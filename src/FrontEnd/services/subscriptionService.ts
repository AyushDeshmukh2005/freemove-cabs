
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/subscriptions';

export interface SubscriptionPlan {
  id: number;
  title: string;
  price: number;
  ridesPerMonth: number;
  description: string;
  features: string[];
}

export interface UserSubscription {
  id: number;
  userId: number;
  planType: 'basic' | 'premium' | 'unlimited';
  ridesTotal: number;
  ridesRemaining: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  price: number;
  createdAt: string;
  updatedAt: string;
}

// Get available subscription plans
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await axios.get(`${API_URL}/plans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    throw error;
  }
};

// Get user's active subscription
export const getUserSubscription = async (userId: number): Promise<UserSubscription | null> => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    // Return null if user has no subscription
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

// Purchase a subscription
export const purchaseSubscription = async (userId: number, planId: number) => {
  try {
    const response = await axios.post(`${API_URL}/purchase`, { userId, planId });
    return response.data;
  } catch (error) {
    console.error('Error purchasing subscription:', error);
    throw error;
  }
};

// Cancel subscription
export const cancelSubscription = async (subscriptionId: number) => {
  try {
    const response = await axios.patch(`${API_URL}/${subscriptionId}/cancel`);
    return response.data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

export default {
  getSubscriptionPlans,
  getUserSubscription,
  purchaseSubscription,
  cancelSubscription
};
