
import axios from 'axios';
import { db } from '@database/databaseService';

export interface QuietHours {
  id?: string;
  userId: string;
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  daysOfWeek: string[]; // e.g. ["monday", "tuesday", ...]
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationSettings {
  id?: string;
  userId: string;
  rideUpdates: boolean;
  promotions: boolean;
  driverArrival: boolean;
  paymentReceipts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

export const notificationService = {
  // Get quiet hours for a user
  getQuietHours: async (userId: string): Promise<QuietHours> => {
    try {
      const response = await axios.get(`/api/users/${userId}/quiet-hours`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching quiet hours:', error);
      throw new Error('Failed to fetch quiet hours settings');
    }
  },

  // Update quiet hours
  updateQuietHours: async (userId: string, data: Omit<QuietHours, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<QuietHours> => {
    try {
      const response = await axios.patch(`/api/users/${userId}/quiet-hours`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating quiet hours:', error);
      throw new Error('Failed to update quiet hours settings');
    }
  },

  // Get notification settings
  getNotificationSettings: async (userId: string): Promise<NotificationSettings> => {
    try {
      const response = await axios.get(`/api/users/${userId}/notifications`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw new Error('Failed to fetch notification settings');
    }
  },

  // Update notification settings
  updateNotificationSettings: async (userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    try {
      const response = await axios.patch(`/api/users/${userId}/notifications`, settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw new Error('Failed to update notification settings');
    }
  },

  // Send test notification
  sendTestNotification: async (userId: string, type: string): Promise<void> => {
    try {
      await axios.post(`/api/users/${userId}/send-test-notification`, { type });
    } catch (error) {
      console.error('Error sending test notification:', error);
      throw new Error('Failed to send test notification');
    }
  }
};
