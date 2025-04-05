import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  expiryDate?: Date;
}

const DriverRewards = () => {
  const { toast } = useToast();
  const [points, setPoints] = useState(1500);
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: "reward-1",
      name: "Free Coffee",
      description: "Enjoy a complimentary coffee at any partner cafe.",
      pointCost: 500,
    },
    {
      id: "reward-2",
      name: "$20 Gas Card",
      description: "Get a $20 gas card to help with fuel costs.",
      pointCost: 1000,
    },
    {
      id: "reward-3",
      name: "Car Wash Voucher",
      description: "Treat your car to a free wash and detailing.",
      pointCost: 750,
    },
    {
      id: "reward-4",
      name: "Premium Subscription",
      description: "One month of premium subscription benefits.",
      pointCost: 1200,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
    },
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Fix the click method error
  const handleRedeemClick = (rewardId: string) => {
    // Implementation for redeeming rewards
    const selectedReward = rewards.find(r => r.id === rewardId);
    if (selectedReward && points >= selectedReward.pointCost) {
      setPoints(points - selectedReward.pointCost);
      toast({
        title: "Reward Redeemed",
        description: `You have successfully redeemed ${selectedReward.name}`,
      });
    } else {
      toast({
        title: "Not Enough Points",
        description: "You don't have enough points to redeem this reward",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gocabs-primary mb-2">Driver Rewards</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Redeem your hard-earned points for exclusive rewards.
        </p>
        <Badge className="mt-4">
          Current Points: {points}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id} className="overflow-hidden">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{reward.name}</CardTitle>
              <CardDescription>{reward.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm mb-2">
                <span className="font-semibold">{reward.pointCost}</span> points
              </p>
              {reward.expiryDate && (
                <p className="text-xs text-muted-foreground">
                  Expires: {formatDate(reward.expiryDate)}
                </p>
              )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full" 
                disabled={points < reward.pointCost} 
                onClick={() => handleRedeemClick(reward.id)}
              >
                Redeem Reward
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DriverRewards;
