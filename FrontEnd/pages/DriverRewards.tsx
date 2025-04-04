
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Award,
  Gift,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  BadgeCheck,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '../components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DriverRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Dummy state for rewards and points
  const [points, setPoints] = useState(1250);
  const [rewardsHistory, setRewardsHistory] = useState([
    { 
      id: 1, 
      title: "10% Discount Coupon", 
      points: 500, 
      redeemedAt: new Date(2025, 3, 2), 
      status: "active"
    },
    { 
      id: 2, 
      title: "Free Ride (up to $15)", 
      points: 750, 
      redeemedAt: new Date(2025, 3, 1), 
      status: "used" 
    },
    { 
      id: 3, 
      title: "Priority Matching", 
      points: 300, 
      redeemedAt: new Date(2025, 2, 28), 
      status: "expired" 
    }
  ]);
  
  const [availableRewards, setAvailableRewards] = useState([
    { 
      id: 1, 
      title: "15% Discount On Next Ride", 
      description: "Get 15% off on your next ride (up to $20)", 
      points: 800, 
      type: "discount"
    },
    { 
      id: 2, 
      title: "Free Ride", 
      description: "One free ride up to $25", 
      points: 1200, 
      type: "free_ride"
    },
    { 
      id: 3, 
      title: "Priority Driver", 
      description: "Get priority matching with premium drivers for 1 week", 
      points: 1000, 
      type: "priority" 
    },
    { 
      id: 4, 
      title: "Airport Pickup Upgrade", 
      description: "Free upgrade to premium vehicle for airport pickup", 
      points: 900, 
      type: "upgrade" 
    }
  ]);
  
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Frequent Rider",
      description: "Complete 10 rides in a month",
      progress: 80,
      reward: 200,
      completed: false
    },
    {
      id: 2,
      title: "Perfect Rating",
      description: "Maintain a 5-star rating for 5 consecutive rides",
      progress: 100,
      reward: 300,
      completed: true
    },
    {
      id: 3,
      title: "City Explorer",
      description: "Take rides in 5 different areas of the city",
      progress: 60,
      reward: 250,
      completed: false
    },
    {
      id: 4,
      title: "Early Bird",
      description: "Book 3 rides before 7am",
      progress: 33,
      reward: 150,
      completed: false
    }
  ]);
  
  // Handler to redeem rewards
  const handleRedeemReward = (reward) => {
    if (points >= reward.points) {
      setPoints(points - reward.points);
      
      const date = new Date();
      const newReward = {
        id: Math.max(0, ...rewardsHistory.map(r => r.id)) + 1,
        title: reward.title,
        points: reward.points,
        redeemedAt: date,
        status: "active"
      };
      
      setRewardsHistory([newReward, ...rewardsHistory]);
      
      toast({
        title: "Reward Redeemed",
        description: `You've redeemed ${reward.title}`,
      });
    } else {
      toast({
        title: "Not Enough Points",
        description: `You need ${reward.points - points} more points for this reward`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Award className="h-8 w-8 text-primary mr-2" />
            <div>
              <h1 className="text-2xl font-bold">Driver Rewards</h1>
              <p className="text-gray-500">Earn and redeem points for special perks</p>
            </div>
          </div>
          
          <div className="flex items-center bg-primary/10 rounded-xl px-4 py-2">
            <div className="mr-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">Your Points</p>
              <p className="text-2xl font-bold text-primary">{points}</p>
            </div>
            <Star className="h-10 w-10 text-amber-400" />
          </div>
        </div>
        
        <Tabs defaultValue="rewards" className="space-y-6">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
            <TabsTrigger value="history">Rewards History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          {/* Available Rewards Tab */}
          <TabsContent value="rewards">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableRewards.map((reward) => (
                <Card key={reward.id}>
                  <CardHeader className="pb-3">
                    <CardTitle>{reward.title}</CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-400 mr-2" />
                        <span className="font-bold">{reward.points} points</span>
                      </div>
                      <Button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={points < reward.points}
                      >
                        Redeem
                      </Button>
                    </div>
                    {points < reward.points && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-1">
                          You need {reward.points - points} more points
                        </p>
                        <Progress value={(points / reward.points) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Rewards History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Your Rewards History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rewardsHistory.length > 0 ? (
                  <div className="space-y-4">
                    {rewardsHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-3">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{item.title}</h3>
                            <Badge 
                              className={`ml-2 ${
                                item.status === 'active' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : item.status === 'used' 
                                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-3 w-3 mr-1 text-amber-400" />
                            {item.points} points • {item.redeemedAt.toLocaleDateString()}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gift className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium mb-1">No rewards yet</h3>
                    <p className="text-gray-500">Redeem your points to see your reward history here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <div className="grid gap-6 md:grid-cols-2">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.completed ? "border-green-500 dark:border-green-600" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center">
                        {achievement.completed ? (
                          <BadgeCheck className="h-5 w-5 mr-2 text-green-500" />
                        ) : (
                          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        )}
                        {achievement.title}
                      </CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-400 mr-1" />
                        <span className="font-medium">{achievement.reward}</span>
                      </div>
                    </div>
                    <CardDescription>{achievement.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {achievement.completed ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          <span className="text-sm">Completed! Points awarded.</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DriverRewards;
