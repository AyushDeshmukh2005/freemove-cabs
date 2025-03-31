
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from '@/components/DashboardLayout';

const SubscriptionPlans = [
  {
    id: 1,
    title: "Basic Plan",
    price: 499,
    ridesPerMonth: 10,
    description: "Perfect for occasional riders",
    features: [
      "10 rides per month",
      "No surge pricing",
      "Valid for 30 days",
      "Standard rides only"
    ]
  },
  {
    id: 2,
    title: "Premium Plan",
    price: 899,
    ridesPerMonth: 25,
    description: "Great for regular commuters",
    features: [
      "25 rides per month",
      "No surge pricing",
      "Priority pickup",
      "Valid for 30 days",
      "Standard & Premium rides"
    ]
  },
  {
    id: 3,
    title: "Unlimited Plan",
    price: 1499,
    ridesPerMonth: 999,
    description: "For daily travelers",
    features: [
      "Unlimited rides (max 3 per day)",
      "No surge pricing",
      "Priority pickup",
      "24/7 customer support",
      "All ride types included",
      "Valid for 30 days"
    ]
  }
];

const Subscriptions = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Monthly Ride Passes</h1>
        <p className="text-muted-foreground mb-6">
          Subscribe to monthly ride passes for discounted rates and enjoy special benefits.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SubscriptionPlans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <span className="text-3xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground"> / month</span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {plan.ridesPerMonth === 999 ? 'Unlimited rides' : `${plan.ridesPerMonth} rides per month`}
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="h-4 w-4 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Subscribe Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How Monthly Passes Work</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Choose a subscription plan that fits your needs.</li>
            <li>Complete the payment to activate your subscription.</li>
            <li>Your rides will be automatically deducted from your monthly quota.</li>
            <li>Track your remaining rides in the app dashboard.</li>
            <li>Unused rides expire at the end of the 30-day period.</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;
