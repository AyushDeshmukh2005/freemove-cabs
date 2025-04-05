import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
}

interface ActiveSubscription {
  id: string;
  name: string;
  price: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'cancelled';
}

const Subscriptions = () => {
  const { toast } = useToast();
  const [activeSubscription, setActiveSubscription] = useState<ActiveSubscription | null>(null);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Essential features for getting started',
      price: 9.99,
      features: [
        'Access to standard ride options',
        'Basic customer support',
        'Limited ride history'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Enhanced features for frequent riders',
      price: 19.99,
      features: [
        'Access to premium ride options',
        'Priority customer support',
        'Unlimited ride history',
        'Ride cancellation protection'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Exclusive features for the ultimate experience',
      price: 29.99,
      features: [
        'Access to all ride options',
        '24/7 dedicated customer support',
        'Unlimited ride history',
        'Ride cancellation protection',
        'Personalized ride preferences'
      ]
    }
  ];

  // Fix the click method error
  const handleSubscribeClick = (planId: string) => {
    // Implementation for subscribing to a plan
    const selectedPlan = subscriptionPlans.find(p => p.id === planId);
    if (selectedPlan) {
      setActiveSubscription({
        id: selectedPlan.id,
        name: selectedPlan.name,
        price: selectedPlan.price,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        status: 'active'
      });
      
      toast({
        title: "Subscription Activated",
        description: `You have successfully subscribed to ${selectedPlan.name}`,
      });
    }
  };

  return (
    <div className="container py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Subscription Plans</h2>
        <p className="text-muted-foreground">Choose the plan that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {subscriptionPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "flex flex-col",
              plan.popular && "border-primary"
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {plan.name}
                {plan.popular && (
                  <Badge className="ml-2">Popular</Badge>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-3xl font-bold mb-2">
                ${plan.price.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="h-5 w-5 mr-2 text-green-500 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.popular ? "default" : "outline"}
                onClick={() => handleSubscribeClick(plan.id)}
                disabled={activeSubscription?.id === plan.id}
              >
                {activeSubscription?.id === plan.id ? "Current Plan" : "Choose Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {activeSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Details of your active subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Plan:</strong> {activeSubscription.name}</p>
            <p><strong>Price:</strong> ${activeSubscription.price.toFixed(2)}/month</p>
            <p><strong>Start Date:</strong> {activeSubscription.startDate.toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {activeSubscription.endDate.toLocaleDateString()}</p>
            <p><strong>Status:</strong> {activeSubscription.status}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Subscriptions;
