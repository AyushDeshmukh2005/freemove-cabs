
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Trophy, Star, Clock, Gift, Award, Calendar, ChevronRight, 
  Check, XCircle, HelpCircle, Zap, TrendingUp, BarChart4
} from 'lucide-react';
import { getCompletedRidesCount } from '../services/rideService';

interface RewardTier {
  id: number;
  name: string;
  icon: React.ReactNode;
  rides: number;
  benefits: string[];
  color: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  expiresOn: Date;
  redeemed: boolean;
  category: 'discount' | 'perk' | 'service';
  value: string;
  icon: React.ReactNode;
}

const DriverRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [completedRides, setCompletedRides] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          const rides = await getCompletedRidesCount(user.id);
          setCompletedRides(rides);
        }
      } catch (error) {
        console.error("Error fetching ride count:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  // Reward tiers
  const tiers: RewardTier[] = [
    {
      id: 1,
      name: 'Bronze',
      icon: <Trophy className="h-6 w-6" />,
      rides: 10,
      benefits: ['Basic rewards', 'Driver ratings', 'Ride history'],
      color: 'bg-amber-700'
    },
    {
      id: 2,
      name: 'Silver',
      icon: <Award className="h-6 w-6" />,
      rides: 25,
      benefits: ['All Bronze rewards', '5% discount on rides', 'Priority customer service'],
      color: 'bg-gray-400'
    },
    {
      id: 3,
      name: 'Gold',
      icon: <Star className="h-6 w-6" />,
      rides: 50,
      benefits: ['All Silver rewards', '10% discount on rides', 'Exclusive events', 'Quick driver matching'],
      color: 'bg-yellow-500'
    },
    {
      id: 4,
      name: 'Platinum',
      icon: <Award className="h-6 w-6" />,
      rides: 100,
      benefits: ['All Gold rewards', '15% discount on rides', 'Premium support', 'Free cancellations', 'Service upgrades'],
      color: 'bg-slate-700'
    }
  ];
  
  // Sample rewards
  const rewards: Reward[] = [
    {
      id: '1',
      title: '10% Off Your Next Ride',
      description: 'Get 10% discount on your next ride booking',
      expiresOn: new Date(new Date().setDate(new Date().getDate() + 14)),
      redeemed: false,
      category: 'discount',
      value: '10% OFF',
      icon: <Gift className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'Free Ride Up to ₹100',
      description: 'Enjoy a free ride up to ₹100 value',
      expiresOn: new Date(new Date().setDate(new Date().getDate() + 7)),
      redeemed: false,
      category: 'discount',
      value: '₹100',
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'Premium Car Upgrade',
      description: 'Upgrade to premium vehicle at standard price',
      expiresOn: new Date(new Date().setDate(new Date().getDate() + 30)),
      redeemed: false,
      category: 'service',
      value: 'UPGRADE',
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: '4',
      title: '20% Off Airport Transfer',
      description: '20% discount on airport rides',
      expiresOn: new Date(new Date().setDate(new Date().getDate() + 60)),
      redeemed: false,
      category: 'discount',
      value: '20% OFF',
      icon: <Gift className="h-5 w-5" />
    },
    {
      id: '5',
      title: '5 Free Ride Cancellations',
      description: 'Cancel rides without penalty (5 times)',
      expiresOn: new Date(new Date().setDate(new Date().getDate() + 90)),
      redeemed: false,
      category: 'perk',
      value: 'FREE',
      icon: <XCircle className="h-5 w-5" />
    },
    {
      id: '6',
      title: 'Priority Driver Matching',
      description: 'Get matched with drivers faster for 7 days',
      expiresOn: new Date(new Date().setDate(new Date().getDate() + 7)),
      redeemed: true,
      category: 'perk',
      value: 'ACTIVE',
      icon: <Clock className="h-5 w-5" />
    }
  ];
  
  // Get current tier
  const getCurrentTier = () => {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (completedRides >= tiers[i].rides) {
        return tiers[i];
      }
    }
    return null;
  };
  
  // Get next tier
  const getNextTier = () => {
    for (let i = 0; i < tiers.length; i++) {
      if (completedRides < tiers[i].rides) {
        return tiers[i];
      }
    }
    return null; // Already at highest tier
  };
  
  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  
  // Progress to next tier (percentage)
  const getProgressToNextTier = () => {
    if (!currentTier || !nextTier) {
      return completedRides > 0 ? 100 : 0; // Already at highest tier or no rides
    }
    
    const previousTierRides = currentTier ? currentTier.rides : 0;
    const ridesToNextTier = nextTier.rides - previousTierRides;
    const ridesCompleted = completedRides - previousTierRides;
    
    return Math.min(100, Math.round((ridesCompleted / ridesToNextTier) * 100));
  };
  
  const handleRedeemReward = (reward: Reward) => {
    toast({
      title: "Reward Redeemed",
      description: `Your ${reward.title} has been added to your account.`,
    });
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const filterRewards = (status: 'available' | 'redeemed') => {
    return rewards.filter(reward => status === 'redeemed' ? reward.redeemed : !reward.redeemed);
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Trophy className="h-8 w-8 text-gocabs-primary mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Rewards Program</h1>
              <p className="text-muted-foreground">
                Earn rewards by taking rides with GoCabs.
              </p>
            </div>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Reward Status</CardTitle>
                  <CardDescription>Based on your completed rides</CardDescription>
                </div>
                <div className="flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2 text-gocabs-primary" />
                  <span className="text-xl font-bold">{completedRides} rides</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current Tier */}
                {currentTier && (
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-full ${currentTier.color} flex items-center justify-center text-white`}>
                      {currentTier.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold">{currentTier.name} Member</h3>
                        <Badge variant="outline" className="ml-2 bg-gocabs-primary/10 text-gocabs-primary border-gocabs-primary/20">
                          Current Tier
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentTier.benefits[0]}, {currentTier.benefits[1]} & more
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Progress to Next Tier */}
                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {nextTier.name}</span>
                      <span className="font-medium">{completedRides} / {nextTier.rides} rides</span>
                    </div>
                    <Progress value={getProgressToNextTier()} />
                    <p className="text-xs text-muted-foreground">
                      Complete {nextTier.rides - completedRides} more rides to reach {nextTier.name} tier
                    </p>
                  </div>
                )}
                
                {!nextTier && currentTier && currentTier.id === tiers[tiers.length - 1].id && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <p className="font-medium text-green-700 dark:text-green-400">
                        Congratulations! You've reached the highest tier.
                      </p>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1 ml-7">
                      Enjoy all the exclusive benefits of Platinum membership.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Reward Tiers Info */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Reward Tiers & Benefits
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tiers.map(tier => (
                <Card key={tier.id} className={`
                  ${currentTier && currentTier.id === tier.id ? 'border-gocabs-primary' : ''}
                `}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <div className={`h-6 w-6 rounded-full ${tier.color} flex items-center justify-center text-white`}>
                          {tier.icon}
                        </div>
                        <span>{tier.name}</span>
                      </CardTitle>
                      <span className="text-sm font-medium">{tier.rides}+ rides</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Your Rewards */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Your Rewards
            </h2>
            
            <Tabs defaultValue="available" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Available Rewards</TabsTrigger>
                <TabsTrigger value="redeemed">Redeemed Rewards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="available">
                <div className="space-y-4">
                  {filterRewards('available').length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">You don't have any available rewards yet.</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete more rides to earn rewards!
                      </p>
                    </div>
                  ) : (
                    filterRewards('available').map(reward => (
                      <Card key={reward.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center md:items-start space-x-4">
                            <div className="bg-gocabs-primary/10 p-2 rounded-lg text-gocabs-primary">
                              {reward.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">{reward.title}</h3>
                                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                                </div>
                                <Badge variant="outline" className="hidden md:inline-flex ml-2 bg-green-50 text-green-600 border-green-100">
                                  {reward.value}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="h-3.5 w-3.5 mr-1" />
                                  Expires: {formatDate(reward.expiresOn)}
                                </div>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleRedeemReward(reward)}
                                  variant="default"
                                >
                                  Redeem
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="redeemed">
                <div className="space-y-4">
                  {filterRewards('redeemed').length === 0 ? (
                    <div className="text-center p-8 border border-dashed rounded-lg">
                      <Check className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">You haven't redeemed any rewards yet.</p>
                    </div>
                  ) : (
                    filterRewards('redeemed').map(reward => (
                      <Card key={reward.id} className="opacity-80">
                        <CardContent className="p-4">
                          <div className="flex items-center md:items-start space-x-4">
                            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg text-gray-500">
                              {reward.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">{reward.title}</h3>
                                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                                </div>
                                <Badge variant="outline" className="hidden md:inline-flex ml-2 bg-gray-100 text-gray-500 border-gray-200">
                                  REDEEMED
                                </Badge>
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground mt-2">
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Redeemed
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Help Section */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex space-x-3">
            <HelpCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Questions about the rewards program?
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                View our <button className="text-blue-700 dark:text-blue-200 underline">Rewards FAQ</button> or <button className="text-blue-700 dark:text-blue-200 underline">contact support</button> for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DriverRewards;
