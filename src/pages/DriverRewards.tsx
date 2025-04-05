
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Award, Gift, Calendar, Smile, CheckCircle, Star, TrendingUp, BarChart } from 'lucide-react';

const DriverRewards = () => {
  const { toast } = useToast();
  const [pointsData, setPointsData] = useState({
    totalPoints: 1250,
    currentLevel: 'Silver',
    nextLevel: 'Gold',
    pointsToNextLevel: 750,
    pointsThisMonth: 320,
  });
  
  const [rewards, setRewards] = useState([
    {
      id: '1',
      name: 'Free Car Wash',
      description: 'One free premium car wash at partnered locations',
      pointsCost: 200,
      expiryDate: '2025-05-30',
      isAvailable: true,
      category: 'service'
    },
    {
      id: '2',
      name: 'Fuel Discount Card',
      description: '10% off on fuel purchases for one month',
      pointsCost: 500,
      expiryDate: '2025-04-30',
      isAvailable: true,
      category: 'discount'
    },
    {
      id: '3',
      name: 'Premium Dashboard',
      description: 'Unlock premium features on your driver dashboard',
      pointsCost: 1000,
      expiryDate: '2025-06-15',
      isAvailable: true,
      category: 'feature'
    },
    {
      id: '4',
      name: 'Car Maintenance',
      description: 'Free basic car maintenance service',
      pointsCost: 800,
      expiryDate: '2025-05-10',
      isAvailable: true,
      category: 'service'
    }
  ]);

  const [claimedRewards, setClaimedRewards] = useState([
    {
      id: '5',
      name: 'Priority Rides',
      description: 'Get priority access to high-fare rides for 1 week',
      pointsCost: 300,
      claimDate: '2025-03-15',
      expiryDate: '2025-03-22',
      redeemed: true,
      category: 'feature'
    }
  ]);
  
  const [activities, setActivities] = useState([
    {
      id: '1',
      type: 'ride_completed',
      description: 'Completed 5-star ride',
      points: 25,
      date: '2025-04-04'
    },
    {
      id: '2',
      type: 'consecutive_days',
      description: '5 consecutive days active',
      points: 75,
      date: '2025-04-03'
    },
    {
      id: '3',
      type: 'peak_hours',
      description: 'Peak hours bonus',
      points: 50,
      date: '2025-04-02'
    },
    {
      id: '4',
      type: 'referral',
      description: 'Driver referral bonus',
      points: 200,
      date: '2025-03-28'
    },
    {
      id: '5',
      type: 'challenge',
      description: 'Weekend challenge completed',
      points: 100,
      date: '2025-03-25'
    }
  ]);
  
  const handleClaimReward = (rewardId: string) => {
    const rewardToClaim = rewards.find(reward => reward.id === rewardId);
    
    if (rewardToClaim) {
      if (pointsData.totalPoints < rewardToClaim.pointsCost) {
        toast({
          title: "Not enough points",
          description: `You need ${rewardToClaim.pointsCost - pointsData.totalPoints} more points to claim this reward.`,
          variant: "destructive",
        });
        return;
      }
      
      // Update points
      setPointsData({
        ...pointsData,
        totalPoints: pointsData.totalPoints - rewardToClaim.pointsCost
      });
      
      // Move reward from available to claimed
      setRewards(rewards.filter(r => r.id !== rewardId));
      setClaimedRewards([
        ...claimedRewards,
        {
          ...rewardToClaim,
          claimDate: new Date().toISOString().split('T')[0],
          redeemed: false
        }
      ]);
      
      toast({
        title: "Reward Claimed",
        description: `You have successfully claimed ${rewardToClaim.name}.`,
      });
    }
  };
  
  const handleRedeemReward = (rewardId: string) => {
    setClaimedRewards(
      claimedRewards.map(reward => 
        reward.id === rewardId ? { ...reward, redeemed: true } : reward
      )
    );
    
    toast({
      title: "Reward Redeemed",
      description: "Your reward has been successfully redeemed.",
    });
  };
  
  const getProgressColor = () => {
    const progress = (pointsData.totalPoints / (pointsData.totalPoints + pointsData.pointsToNextLevel)) * 100;
    if (progress > 75) return "bg-green-500";
    if (progress > 40) return "bg-blue-500";
    return "bg-gocabs-primary";
  };

  const tiers = [
    { name: "Bronze", points: 0, perks: ["Basic driver support", "Standard ride matching"] },
    { name: "Silver", points: 1000, perks: ["Priority customer support", "5% bonus on peak rides", "Monthly car wash discount"] },
    { name: "Gold", points: 2000, perks: ["Dedicated support line", "10% bonus on peak rides", "Monthly car wash free", "Fuel discounts"] },
    { name: "Platinum", points: 5000, perks: ["VIP support 24/7", "15% bonus on all rides", "Weekly car wash free", "Premium fuel & maintenance discounts", "Early access to new features"] },
    { name: "Diamond", points: 10000, perks: ["Concierge support", "20% bonus on all rides", "Unlimited car washes", "Comprehensive car maintenance program", "Exclusive driver events"] }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Driver Rewards</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Earn points and claim rewards as you complete rides
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2 text-amber-500" />
              Your Reward Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <div className="flex items-center mb-1">
                  <h3 className="font-bold text-lg">{pointsData.currentLevel} Tier</h3>
                  <Badge className="ml-2 bg-amber-500">{pointsData.totalPoints} Points</Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {pointsData.pointsToNextLevel} points to reach {pointsData.nextLevel} tier
                </p>
              </div>
              <div className="mt-2 md:mt-0 text-right">
                <p className="text-sm font-medium">Points this month: {pointsData.pointsThisMonth}</p>
              </div>
            </div>
            
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>{pointsData.currentLevel}</span>
                <span>{pointsData.nextLevel}</span>
              </div>
              <Progress 
                value={(pointsData.totalPoints / (pointsData.totalPoints + pointsData.pointsToNextLevel)) * 100} 
                className={`h-2 ${getProgressColor()}`}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <Star className="h-5 w-5 text-yellow-500 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                <p className="font-semibold">4.92/5</p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Active Days</p>
                <p className="font-semibold">24 days</p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <TrendingUp className="h-5 w-5 text-green-500 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="font-semibold">98%</p>
              </div>
              
              <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <Smile className="h-5 w-5 text-orange-500 mb-1" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Compliments</p>
                <p className="font-semibold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="rewards">
          <TabsList className="mb-4">
            <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
            <TabsTrigger value="claimed">My Rewards</TabsTrigger>
            <TabsTrigger value="activity">Point History</TabsTrigger>
            <TabsTrigger value="tiers">Reward Tiers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rewards" className="space-y-4">
            {rewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="overflow-hidden">
                    <div className={`h-2 ${
                      reward.category === 'service'
                        ? 'bg-blue-500'
                        : reward.category === 'discount'
                        ? 'bg-green-500'
                        : 'bg-purple-500'
                    }`} />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{reward.name}</CardTitle>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="font-normal">
                          {reward.pointsCost} Points
                        </Badge>
                        <p className="text-xs text-gray-500">
                          Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        onClick={() => handleClaimReward(reward.id)} 
                        disabled={pointsData.totalPoints < reward.pointsCost}
                        className="w-full"
                      >
                        {pointsData.totalPoints >= reward.pointsCost
                          ? "Claim Reward"
                          : `Need ${reward.pointsCost - pointsData.totalPoints} More Points`
                        }
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No Available Rewards</h3>
                <p className="text-gray-500 mt-1">
                  Check back later for new rewards or earn more points to unlock special offers.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="claimed" className="space-y-4">
            {claimedRewards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claimedRewards.map((reward) => (
                  <Card key={reward.id} className={`${reward.redeemed ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        {reward.redeemed && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Redeemed
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{reward.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm">
                        <p className="text-gray-500">
                          Claimed: {new Date(reward.claimDate).toLocaleDateString()}
                        </p>
                        <p className={`${reward.redeemed ? 'text-gray-500' : 'text-red-500'}`}>
                          Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {!reward.redeemed && (
                        <Button 
                          onClick={() => handleRedeemReward(reward.id)}
                          variant="outline"
                          className="w-full"
                        >
                          Redeem Now
                        </Button>
                      )}
                      {reward.redeemed && (
                        <p className="text-sm text-center w-full text-gray-500">
                          You've redeemed this reward on {new Date(reward.claimDate).toLocaleDateString()}
                        </p>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 mx-auto text-gray-300" />
                <h3 className="mt-4 text-lg font-medium">No Claimed Rewards</h3>
                <p className="text-gray-500 mt-1">
                  You haven't claimed any rewards yet. Check out the available rewards.
                </p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.querySelector('[value="rewards"]')?.click()}
                >
                  View Available Rewards
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Points Activity
                </CardTitle>
                <CardDescription>
                  Recent points earned from your activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="flex justify-between items-center p-3 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">
                        +{activity.points} points
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tiers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reward Tiers & Benefits</CardTitle>
                <CardDescription>
                  Unlock more benefits as you progress through tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tiers.map((tier, index) => (
                    <div 
                      key={tier.name} 
                      className={`border rounded-lg p-4 ${
                        tier.name === pointsData.currentLevel 
                          ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20' 
                          : ''
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center">
                          <div className={`h-6 w-6 rounded-full mr-2 flex items-center justify-center ${
                            index === 0 ? 'bg-orange-700' :
                            index === 1 ? 'bg-gray-400' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-gray-200' :
                            'bg-blue-500'
                          }`}>
                            <Award className="h-3 w-3 text-white" />
                          </div>
                          <h3 className="font-semibold">{tier.name}</h3>
                        </div>
                        <Badge variant="outline" className="text-gray-600">
                          {tier.points.toLocaleString()} Points
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 ml-8">
                        {tier.perks.map((perk, i) => (
                          <div key={i} className="flex items-start">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1.5 mt-1" />
                            <p className="text-sm">{perk}</p>
                          </div>
                        ))}
                      </div>
                      
                      {tier.name === pointsData.currentLevel && (
                        <p className="text-sm mt-2 text-amber-600 font-medium">
                          Your current tier
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DriverRewards;
