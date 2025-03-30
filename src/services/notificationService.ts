
// Notification service for managing user notification preferences

export type QuietHours = {
  enabled: boolean;
  startTime: string; // Format: "HH:MM" in 24-hour format
  endTime: string; // Format: "HH:MM" in 24-hour format
  days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'>;
};

export type NotificationSettings = {
  userId: string;
  quietHours: QuietHours;
  rideUpdates: boolean;
  promotions: boolean;
  driverArrival: boolean;
  paymentReceipts: boolean;
  newFeatures: boolean;
};

// Store notification settings in memory
const userNotificationSettings: Record<string, NotificationSettings> = {};

export const notificationService = {
  // Get notification settings for a user
  getSettings: (userId: string): Promise<NotificationSettings> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return existing settings or create defaults
        const settings = userNotificationSettings[userId] || {
          userId,
          quietHours: {
            enabled: false,
            startTime: "22:00",
            endTime: "07:00",
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          },
          rideUpdates: true,
          promotions: true,
          driverArrival: true,
          paymentReceipts: true,
          newFeatures: true
        };
        
        resolve(settings);
      }, 300);
    });
  },
  
  // Update notification settings for a user
  updateSettings: (userId: string, settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get current settings or create defaults
        const currentSettings = userNotificationSettings[userId] || {
          userId,
          quietHours: {
            enabled: false,
            startTime: "22:00",
            endTime: "07:00",
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
          },
          rideUpdates: true,
          promotions: true,
          driverArrival: true,
          paymentReceipts: true,
          newFeatures: true
        };
        
        // Update settings
        userNotificationSettings[userId] = {
          ...currentSettings,
          ...settings,
          // Handle nested quiet hours object
          quietHours: settings.quietHours 
            ? { ...currentSettings.quietHours, ...settings.quietHours }
            : currentSettings.quietHours
        };
        
        resolve(userNotificationSettings[userId]);
      }, 300);
    });
  },
  
  // Check if current time is within quiet hours for a user
  isInQuietHours: (userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const settings = userNotificationSettings[userId];
        
        // If no settings or quiet hours not enabled, not in quiet hours
        if (!settings || !settings.quietHours.enabled) {
          resolve(false);
          return;
        }
        
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
        
        // Check if current day is in quiet hours days
        if (!settings.quietHours.days.includes(currentDay as any)) {
          resolve(false);
          return;
        }
        
        // Parse start and end times
        const [startHour, startMinute] = settings.quietHours.startTime.split(':').map(Number);
        const [endHour, endMinute] = settings.quietHours.endTime.split(':').map(Number);
        
        // Create date objects for start and end times today
        const startTime = new Date();
        startTime.setHours(startHour, startMinute, 0);
        
        const endTime = new Date();
        endTime.setHours(endHour, endMinute, 0);
        
        // Handle overnight quiet hours
        if (startTime > endTime) {
          // If current time is after start time or before end time
          resolve(now >= startTime || now <= endTime);
        } else {
          // If current time is between start and end time
          resolve(now >= startTime && now <= endTime);
        }
      }, 100);
    });
  },
  
  // Send a notification to a user
  sendNotification: async (
    userId: string, 
    title: string, 
    message: string, 
    type: 'ride' | 'promo' | 'driver' | 'payment' | 'feature' | 'critical'
  ): Promise<boolean> => {
    // Check user notification settings
    const settings = await notificationService.getSettings(userId);
    
    // Check if it's a critical notification (always sent)
    if (type === 'critical') {
      console.log(`[CRITICAL NOTIFICATION] To: ${userId}, Title: ${title}, Message: ${message}`);
      return true;
    }
    
    // Check quiet hours
    const inQuietHours = await notificationService.isInQuietHours(userId);
    
    // If in quiet hours and not a critical notification, don't send
    if (inQuietHours) {
      console.log(`[QUIET HOURS] Suppressed notification to ${userId}`);
      return false;
    }
    
    // Check notification type preferences
    let shouldSend = false;
    
    switch (type) {
      case 'ride':
        shouldSend = settings.rideUpdates;
        break;
      case 'promo':
        shouldSend = settings.promotions;
        break;
      case 'driver':
        shouldSend = settings.driverArrival;
        break;
      case 'payment':
        shouldSend = settings.paymentReceipts;
        break;
      case 'feature':
        shouldSend = settings.newFeatures;
        break;
    }
    
    if (shouldSend) {
      console.log(`[NOTIFICATION SENT] To: ${userId}, Type: ${type}, Title: ${title}`);
      return true;
    } else {
      console.log(`[NOTIFICATION SUPPRESSED] To: ${userId}, Type: ${type} (disabled by user)`);
      return false;
    }
  }
};
