import { db } from '../../Database/database';

// Types
export type Notification = {
  id: string;
  userId: string;
  type: 'ride' | 'payment' | 'promo' | 'system';
  message: string;
  data: any;
  read: boolean;
  createdAt: Date;
};

export type QuietHours = {
  id: string;
  userId: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  daysOfWeek: string[];
};

export type NotificationSettings = {
  id: string;
  userId: string;
  ride: boolean;
  payment: boolean;
  promo: boolean;
  system: boolean;
};

export const notificationService = {
  getSettings: async (userId: string): Promise<NotificationSettings> => {
    // Implementation would go here
    return {
      id: 'settings-1',
      userId,
      ride: true,
      payment: true,
      promo: true,
      system: true
    };
  },
  
  updateSettings: async (userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    // Implementation would go here
    return {
      id: 'settings-1',
      userId,
      ride: true,
      payment: true,
      promo: true,
      system: true,
      ...settings
    };
  },

  getQuietHours: async (userId: string): Promise<QuietHours> => {
    // Implementation would go here
    return {
      id: 'quiet-1',
      userId,
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      daysOfWeek: ['1', '2', '3', '4', '5']
    };
  },

  updateQuietHours: async (userId: string, settings: Partial<QuietHours>): Promise<QuietHours> => {
    // Implementation would go here
    return {
      id: 'quiet-1',
      userId,
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
      daysOfWeek: ['1', '2', '3', '4', '5'],
      ...settings
    };
  }
};

/**
 * Send a notification to a user
 */
export const sendNotification = async (
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
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
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
};

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    return await db.query('notifications', { userId }) as Notification[];
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw new Error('Failed to get user notifications');
  }
};

/**
 * Format a notification timestamp for display
 */
export const formatNotificationTime = (date: Date): string => {
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
};
