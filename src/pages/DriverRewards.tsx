
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { driverRewardsService, DriverReward } from '@/services/driverRewardsService';
import { 
  Trophy, 
  Star, 
  Award, 
  Gift, 
  ArrowUpRight, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const DriverRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [rewards, setRewards] = useState<DriverReward | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load driver rewards
  useEffect(() => {
    const loadRewards = async () => {
      if (!user) return;
      
      try {
        const driverRewards = await driverRewardsService.getDriverRewards(user.id);
        setRewards(driverRewards);
      } catch (error) {
        toast({
          title: "Failed to Load Rewards",
          description: "There was an error loading your rewards data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadRewards();
  }, [user, toast]);
  
  const getLevelInfo = (level: 'bronze' | 'silver' | 'gold' | 'platinum') => {
    switch (level) {
      case 'bronze':
        return {
          color: 'text-amber-600',
          bgColor: 'bg-amber-100 dark:bg-amber-900/30',
          icon: <Trophy className="h-5 w-5 text-amber-600" />,
          nextLevel: 'silver',
          pointsToNext: 500,
          benefits: ['Standard ride requests', 'Basic driver support', 'Weekly earnings']
        };
      case 'silver':
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100 dark:bg-gray-800',
          icon: <Trophy className="h-5 w-5 text-gray-500" />,
          nextLevel: 'gold',
          pointsToNext: 2000,
          benefits: ['Priority ride matching', '24/7 premium support', '3% extra earnings', 'Cancellation protection']
        };
      case 'gold':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
          nextLevel: 'platinum',
          pointsToNext: 5000,
          benefits: ['Premium ride priority', 'Dedicated support line', '8% extra earnings', 'Exclusive promotions', 'Flexible schedule']
        };
      case 'platinum':
        return {
          color: 'text-purple-600',
          bgColor: 'bg-purple-100 dark:bg-purple-900/30',
          icon: <ShieldCheck className="h-5 w-5 text-purple-600" />,
          nextLevel: null,
          pointsToNext: null,
          benefits: ['First access to all rides', 'VIP support', '15% extra earnings', 'Special events access', 'Free account benefits', 'Loyalty rewards']
        };
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-24" />
          </div>
          
          <Skeleton className="h-32 w-full rounded-xl mb-6" />
          <Skeleton className="h-64 w-full rounded-xl mb-6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }
  
  if (!rewards) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Driver Rewards</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
          
          <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 text-center">
            <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Rewards Data</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We couldn't find any rewards data for your account.
            </p>
            <Button 
              className="bg-gocabs-primary hover:bg-gocabs-primary/90"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const levelInfo = getLevelInfo(rewards.level);
  
  // Calculate progress to next level
  const getProgressToNextLevel = () => {
    if (rewards.level === 'bronze') {
      return (rewards.totalPoints / 500) * 100;
    } else if (rewards.level === 'silver') {
      return ((rewards.totalPoints - 500) / 1500) * 100;
    } else if (rewards.level === 'gold') {
      return ((rewards.totalPoints - 2000) / 3000) * 100;
    }
    return 100;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Driver Rewards</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        {/* Level & Points Summary */}
        <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`${levelInfo.bgColor} p-2 rounded-full mr-3`}>
                {levelInfo.icon}
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white capitalize">
                  {rewards.level} Driver
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {rewards.totalPoints} total points
                </p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="text-gocabs-primary border-gocabs-primary"
              onClick={() => {
                toast({
                  title: "Points History",
                  description: "Feature coming soon! You'll be able to see your detailed points history here.",
                });
              }}
            >
              View History
            </Button>
          </div>
          
          {levelInfo.nextLevel && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">
                  Progress to {levelInfo.nextLevel}
                </span>
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {rewards.totalPoints} / {levelInfo.pointsToNext} points
                </span>
              </div>
              <Progress value={getProgressToNextLevel()} className="h-2" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {Math.max(0, levelInfo.pointsToNext! - rewards.totalPoints)} more points needed to reach {levelInfo.nextLevel}
              </p>
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">Level Benefits:</h3>
            <ul className="space-y-2">
              {levelInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <Award className="h-5 w-5 text-gocabs-primary mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Your Achievements
            </h2>
          </div>
          
          {rewards.achievements.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <Award className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You haven't earned any achievements yet. Complete rides to earn your first achievement!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start">
                    <div className="bg-gocabs-primary/10 p-2 rounded-full mr-3 flex-shrink-0">
                      <Star className="h-5 w-5 text-gocabs-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{achievement.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                          +{achievement.pointsAwarded} points
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Earned {new Date(achievement.dateEarned).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Milestones */}
        <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-gocabs-primary mr-2" />
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Milestones & Rewards
              </h2>
            </div>
            
            <Button 
              variant="link" 
              size="sm" 
              className="text-gocabs-primary p-0 h-auto"
              onClick={() => {
                toast({
                  title: "All Milestones",
                  description: "Feature coming soon! You'll be able to see all available milestones here.",
                });
              }}
            >
              View All <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {rewards.milestones.map((milestone) => (
              <div 
                key={milestone.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    {milestone.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    )}
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-white">{milestone.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        {milestone.completed ? (
                          <span className="text-green-600 dark:text-green-400">Completed</span>
                        ) : (
                          <span>Reward: {milestone.reward}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {milestone.current} / {milestone.target}
                  </span>
                </div>
                
                <Progress 
                  value={(milestone.current / milestone.target) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRewards;
