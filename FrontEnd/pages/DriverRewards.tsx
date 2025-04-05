
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Gift, Car, Calendar, Clock, MapPin, Star, TrendingUp, Users, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const DriverRewards = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('rewards');
  const [driverPoints] = useState(3250);
  const [driverTier] = useState('Gold');
  const [completedRides] = useState(142);
  const [nextTier] = useState('Platinum');
  const [pointsToNextTier] = useState(750);
  
  // Sample rewards data
  const availableRewards = [
    {
      id: '1',
      title: 'Fuel Discount Card',
      description: '5% discount on fuel at participating stations for 1 month',
      pointsCost: 500,
      category: 'fuel',
      isNew: true,
    },
    {
      id: '2',
      title: 'Premium Car Wash',
      description: 'Free premium car wash at select locations',
      pointsCost: 300,
      category: 'service',
      isNew: false,
    },
    {
      id: '3',
      title: 'Maintenance Discount',
      description: '20% off your next service',
      pointsCost: 800,
      category: 'service',
      isNew: false,
    },
    {
      id: '4',
      title: 'Free Car Inspection',
      description: 'Complete car inspection at authorized centers',
      pointsCost: 400,
      category: 'service',
      isNew: true,
    },
    {
      id: '5',
      title: 'Priority Ride Matching',
      description: 'Get priority in ride matching for 1 week',
      pointsCost: 1000,
      category: 'rides',
      isNew: false,
    }
  ];
  
  const tierBenefits = {
    'Silver': [
      '1% extra earnings on each ride',
      'Basic customer support',
      'Access to basic rewards',
    ],
    'Gold': [
      '3% extra earnings on each ride',
      'Priority customer support',
      'Access to all rewards',
      'Monthly fuel discount',
    ],
    'Platinum': [
      '5% extra earnings on each ride',
      'Premium customer support with dedicated agent',
      'Access to exclusive rewards',
      'Weekly fuel discount',
      'Vehicle maintenance assistance',
    ]
  };
  
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Driver Rewards</h1>
          <p className="text-gray-500 mt-1">
            Earn points and unlock exclusive benefits as you complete rides
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="tiers">Tiers & Benefits</TabsTrigger>
              <TabsTrigger value="history">Points History</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="rewards">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2 text-amber-500" />
                    Your Points
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">{driverPoints}</div>
                  
                  <div className="space-y-4 mt-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{driverTier} Tier</span>
                        <span>{nextTier} Tier</span>
                      </div>
                      <Progress value={(driverPoints / (driverPoints + pointsToNextTier)) * 100} />
                      <p className="text-sm text-gray-500 mt-1">
                        {pointsToNextTier} more points to reach {nextTier}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Car className="h-4 w-4 mr-1" />
                      <span>{completedRides} rides completed</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Your Progress
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="md:col-span-2 space-y-6">
                <h2 className="text-xl font-semibold">Available Rewards</h2>
                
                <div className="space-y-4">
                  {availableRewards.map(reward => (
                    <Card key={reward.id}>
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">{reward.title}</h3>
                            {reward.isNew && (
                              <Badge className="ml-2 bg-green-500">NEW</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {reward.description}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end">
                          <div className="text-lg font-semibold mb-1">{reward.pointsCost} pts</div>
                          <Button 
                            size="sm"
                            disabled={driverPoints < reward.pointsCost}
                          >
                            Redeem
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tiers">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className={`relative overflow-hidden ${driverTier === 'Silver' ? 'border-slate-400' : ''}`}>
                  <div className="absolute top-0 right-0 w-20 h-20">
                    {driverTier === 'Silver' && (
                      <div className="absolute transform rotate-45 translate-y-5 -translate-x-1 bg-slate-400 text-white text-xs font-semibold py-1 right-0 top-0 w-28 text-center">
                        CURRENT
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-slate-400" />
                      Silver Tier
                    </CardTitle>
                    <CardDescription>
                      0 - 2,500 points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tierBenefits['Silver'].map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-slate-400 mt-1" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className={`relative overflow-hidden ${driverTier === 'Gold' ? 'border-amber-500' : ''}`}>
                  <div className="absolute top-0 right-0 w-20 h-20">
                    {driverTier === 'Gold' && (
                      <div className="absolute transform rotate-45 translate-y-5 -translate-x-1 bg-amber-500 text-white text-xs font-semibold py-1 right-0 top-0 w-28 text-center">
                        CURRENT
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-amber-500" />
                      Gold Tier
                    </CardTitle>
                    <CardDescription>
                      2,500 - 5,000 points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tierBenefits['Gold'].map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 text-amber-500 mt-1" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className={`relative overflow-hidden ${driverTier === 'Platinum' ? 'border-slate-700' : ''}`}>
                  <div className="absolute top-0 right-0 w-20 h-20">
                    {driverTier === 'Platinum' && (
                      <div className="absolute transform rotate-45 translate-y-5 -translate-x-1 bg-slate-700 text-white text-xs font-semibold py-1 right-0 top-0 w-28 text-center">
                        CURRENT
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Platinum Tier
                    </CardTitle>
                    <CardDescription>
                      5,000+ points
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tierBenefits['Platinum'].map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 mr-2 mt-1" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>How to Earn Points</CardTitle>
                  <CardDescription>Complete these activities to earn reward points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                        <Car className="h-5 w-5 text-blue-500 dark:text-blue-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">Complete Rides</h3>
                        <p className="text-sm text-gray-500">50 points per ride</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                        <Star className="h-5 w-5 text-green-500 dark:text-green-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">5-Star Rating</h3>
                        <p className="text-sm text-gray-500">20 points per 5-star rating</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-amber-500 dark:text-amber-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">On-Time Arrival</h3>
                        <p className="text-sm text-gray-500">15 points per on-time arrival</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                      <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
                        <Users className="h-5 w-5 text-purple-500 dark:text-purple-300" />
                      </div>
                      <div>
                        <h3 className="font-medium">Referrals</h3>
                        <p className="text-sm text-gray-500">200 points per driver referral</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Points History</CardTitle>
                <CardDescription>Recent points earned and redeemed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Plus className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">Ride Completed</div>
                        <div className="text-sm text-gray-500">Apr 5, 2025 • 8:35 AM</div>
                      </div>
                    </div>
                    <div className="text-green-500 font-medium">+50 pts</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Plus className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">5-Star Rating</div>
                        <div className="text-sm text-gray-500">Apr 4, 2025 • 7:22 PM</div>
                      </div>
                    </div>
                    <div className="text-green-500 font-medium">+20 pts</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Plus className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">Ride Completed</div>
                        <div className="text-sm text-gray-500">Apr 4, 2025 • 2:15 PM</div>
                      </div>
                    </div>
                    <div className="text-green-500 font-medium">+50 pts</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Minus className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <div className="font-medium">Fuel Discount Redeemed</div>
                        <div className="text-sm text-gray-500">Apr 3, 2025 • 11:30 AM</div>
                      </div>
                    </div>
                    <div className="text-red-500 font-medium">-500 pts</div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Plus className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <div className="font-medium">On-time Arrival Bonus</div>
                        <div className="text-sm text-gray-500">Apr 3, 2025 • 10:12 AM</div>
                      </div>
                    </div>
                    <div className="text-green-500 font-medium">+15 pts</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DriverRewards;
