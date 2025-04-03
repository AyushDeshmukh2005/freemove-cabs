
import axios from 'axios';
import { db } from '@database/databaseService';

export interface QuietHours {
  id?: string;
  userId: string;
  enabled: boolean;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  days: string[]; // e.g. ["monday", "tuesday", ...]
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
  quietHours: QuietHours;
}

export type Notification = {
  id: string;
  userId: string;
  type: 'ride' | 'payment' | 'promo' | 'system';
  message: string;
  data: any;
  read: boolean;
  createdAt: Date;
};

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

  // Get settings (includes quiet hours)
  getSettings: async (userId: string): Promise<NotificationSettings> => {
    try {
      const response = await axios.get(`/api/users/${userId}/settings`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw new Error('Failed to fetch user settings');
    }
  },

  // Update settings
  updateSettings: async (userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    try {
      const response = await axios.patch(`/api/users/${userId}/settings`, settings);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw new Error('Failed to update user settings');
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
  },

  // Send a notification to a user
  sendNotification: async (
    userId: string,
    type: Notification['type'],
    message: string,
    data: any
  ): Promise<Notification> => {
    try {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId,
        type,
        message,
        data,
        read: false,
        createdAt: new Date()
      };
      
      await db.insert('notifications', notification);
      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw new Error('Failed to send notification');
    }
  },

  // Mark a notification as read
  markNotificationAsRead: async (notificationId: string): Promise<Notification> => {
    try {
      const notification = await db.getById('notifications', notificationId) as Notification;
      
      if (!notification) {
        throw new Error('Notification not found');
      }
      
      const updatedNotification = {
        ...notification,
        read: true
      } as Notification;
      
      await db.update('notifications', notificationId, updatedNotification);
      return updatedNotification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  },

  // Get all notifications for a user
  getUserNotifications: async (userId: string): Promise<Notification[]> => {
    try {
      return await db.query('notifications', { userId }) as Notification[];
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw new Error('Failed to get user notifications');
    }
  },

  // Format a notification timestamp for display
  formatNotificationTime: (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
    
    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
    
    // Format as date
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined 
    });
  }
};
