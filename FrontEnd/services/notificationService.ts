
import axios from 'axios';
import { db } from '../Database/databaseService';

export interface NotificationSettings {
  id?: string;
  userId: string;
  enablePush: boolean;
  enableEmail: boolean;
  enableSMS: boolean;
  marketingEmails: boolean;
  rideUpdates: boolean;
  promotions: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface QuietHours {
  id?: string;
  userId: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ride_update' | 'promo' | 'system' | 'payment';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

// Get notification settings for a user
export const getNotificationSettings = async (userId: string): Promise<NotificationSettings> => {
  try {
    const response = await axios.get(`/api/users/${userId}/notification-settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    throw new Error('Failed to fetch notification settings');
  }
};

// Update notification settings
export const updateNotificationSettings = async (
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  try {
    const response = await axios.patch(`/api/users/${userId}/notification-settings`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw new Error('Failed to update notification settings');
  }
};

// Get quiet hours settings
export const getQuietHours = async (userId: string): Promise<QuietHours> => {
  try {
    const response = await axios.get(`/api/users/${userId}/quiet-hours`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiet hours:', error);
    throw new Error('Failed to fetch quiet hours');
  }
};

// Update quiet hours settings
export const updateQuietHours = async (
  userId: string,
  settings: Partial<QuietHours>
): Promise<QuietHours> => {
  try {
    const response = await axios.patch(`/api/users/${userId}/quiet-hours`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating quiet hours:', error);
    throw new Error('Failed to update quiet hours');
  }
};

// Get user notifications
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const response = await axios.get(`/api/users/${userId}/notifications`);
    return response.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw new Error('Failed to fetch notifications');
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    await axios.patch(`/api/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
};

// Delete notification
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await axios.delete(`/api/notifications/${notificationId}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw new Error('Failed to delete notification');
  }
};

// Send test notification
export const sendTestNotification = async (userId: string, type: Notification['type']): Promise<void> => {
  try {
    await axios.post(`/api/users/${userId}/send-test-notification`, { type });
  } catch (error) {
    console.error('Error sending test notification:', error);
    throw new Error('Failed to send test notification');
  }
};

export const notificationService = {
  getNotificationSettings,
  updateNotificationSettings,
  getQuietHours,
  updateQuietHours,
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  sendTestNotification
};
