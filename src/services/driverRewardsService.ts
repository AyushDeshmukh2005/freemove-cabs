
import { databaseService } from "./databaseService";

export type DriverReward = {
  id: string;
  driverId: string;
  totalPoints: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  achievements: {
    id: string;
    name: string;
    description: string;
    pointsAwarded: number;
    dateEarned: Date;
    iconName: string;
  }[];
  milestones: {
    id: string;
    name: string;
    target: number;
    current: number;
    reward: string;
    completed: boolean;
  }[];
};

// Point values for different actions
const REWARD_POINTS = {
  RIDE_COMPLETED: 10,
  FIVE_STAR_RATING: 15,
  LONG_RIDE: 20,
  PEAK_HOUR_RIDE: 25,
  CONSECUTIVE_DAYS: 30,
  ECO_RIDE: 35
};

// Achievement definitions
const ACHIEVEMENTS = [
  {
    id: 'first-ride',
    name: 'First Ride',
    description: 'Completed your first ride',
    pointsAwarded: 50,
    iconName: 'trophy'
  },
  {
    id: 'five-star',
    name: 'Five Star Service',
    description: 'Received 5 five-star ratings',
    pointsAwarded: 100,
    iconName: 'star'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Completed 10 rides after midnight',
    pointsAwarded: 150,
    iconName: 'moon'
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Completed 20 eco-friendly rides',
    pointsAwarded: 200,
    iconName: 'leaf'
  }
];

// Calculate driver level based on points
const calculateDriverLevel = (points: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
  if (points < 500) return 'bronze';
  if (points < 2000) return 'silver';
  if (points < 5000) return 'gold';
  return 'platinum';
};

export const driverRewardsService = {
  // Get driver rewards data
  getDriverRewards: (driverId: string): Promise<DriverReward> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let driverReward = databaseService.get<DriverReward>("driverRewards", driverId);
        
        // If driver doesn't have rewards data yet, initialize it
        if (!driverReward) {
          driverReward = {
            id: driverId,
            driverId,
            totalPoints: 0,
            level: 'bronze',
            achievements: [],
            milestones: [
              {
                id: 'rides-50',
                name: '50 Rides',
                target: 50,
                current: 0,
                reward: 'Bonus $25',
                completed: false
              },
              {
                id: 'rides-100',
                name: '100 Rides',
                target: 100,
                current: 0,
                reward: 'Bonus $50',
                completed: false
              },
              {
                id: 'eco-30',
                name: '30 Eco Rides',
                target: 30,
                current: 0,
                reward: 'Premium Status',
                completed: false
              }
            ]
          };
          
          databaseService.add<DriverReward>("driverRewards", driverId, driverReward);
        }
        
        resolve(driverReward);
      }, 300);
    });
  },

  // Add points to driver for completing a ride
  addPointsForRide: (
    driverId: string, 
    rideType: 'standard' | 'premium' | 'eco', 
    rating?: number,
    distance?: number
  ): Promise<number> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        // Get current rewards data
        const rewards = await driverRewardsService.getDriverRewards(driverId);
        
        // Calculate points to award
        let pointsToAdd = REWARD_POINTS.RIDE_COMPLETED;
        
        // Bonus for eco rides
        if (rideType === 'eco') {
          pointsToAdd += REWARD_POINTS.ECO_RIDE;
        }
        
        // Bonus for 5-star ratings
        if (rating && rating === 5) {
          pointsToAdd += REWARD_POINTS.FIVE_STAR_RATING;
        }
        
        // Bonus for long rides
        if (distance && distance > 20) {
          pointsToAdd += REWARD_POINTS.LONG_RIDE;
        }
        
        // Update total points
        const newTotalPoints = rewards.totalPoints + pointsToAdd;
        
        // Update driver level if needed
        const newLevel = calculateDriverLevel(newTotalPoints);
        
        // Update driver rewards in database
        databaseService.update<DriverReward>("driverRewards", driverId, {
          totalPoints: newTotalPoints,
          level: newLevel
        });
        
        resolve(pointsToAdd);
      }, 300);
    });
  },

  // Award an achievement to a driver
  awardAchievement: (driverId: string, achievementId: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        // Get current rewards data
        const rewards = await driverRewardsService.getDriverRewards(driverId);
        
        // Check if achievement already awarded
        if (rewards.achievements.some(a => a.id === achievementId)) {
          resolve(false);
          return;
        }
        
        // Find achievement in definitions
        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) {
          resolve(false);
          return;
        }
        
        // Add achievement and points
        const newAchievement = {
          ...achievement,
          dateEarned: new Date()
        };
        
        const newAchievements = [...rewards.achievements, newAchievement];
        const newTotalPoints = rewards.totalPoints + achievement.pointsAwarded;
        const newLevel = calculateDriverLevel(newTotalPoints);
        
        // Update driver rewards in database
        databaseService.update<DriverReward>("driverRewards", driverId, {
          achievements: newAchievements,
          totalPoints: newTotalPoints,
          level: newLevel
        });
        
        resolve(true);
      }, 300);
    });
  },

  // Update progress toward a milestone
  updateMilestoneProgress: (driverId: string, milestoneId: string, increment: number): Promise<boolean> => {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        // Get current rewards data
        const rewards = await driverRewardsService.getDriverRewards(driverId);
        
        // Find the milestone
        const milestoneIndex = rewards.milestones.findIndex(m => m.id === milestoneId);
        if (milestoneIndex === -1) {
          resolve(false);
          return;
        }
        
        const milestone = rewards.milestones[milestoneIndex];
        
        // Skip if already completed
        if (milestone.completed) {
          resolve(false);
          return;
        }
        
        // Update progress
        const newCurrent = milestone.current + increment;
        const completed = newCurrent >= milestone.target;
        
        const updatedMilestone = {
          ...milestone,
          current: newCurrent,
          completed
        };
        
        const newMilestones = [...rewards.milestones];
        newMilestones[milestoneIndex] = updatedMilestone;
        
        // Update driver rewards in database
        databaseService.update<DriverReward>("driverRewards", driverId, {
          milestones: newMilestones
        });
        
        resolve(completed);
      }, 300);
    });
  }
};
