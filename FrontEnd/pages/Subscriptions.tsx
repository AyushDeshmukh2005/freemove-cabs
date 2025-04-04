
import React from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import DashboardLayout from '../components/DashboardLayout';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../components/ui/badge';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    popular: true,
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

const paymentHistory = [
  {
    id: "INV-2023001",
    date: "Apr 1, 2025",
    amount: 899,
    status: "Successful",
    method: "Credit Card (**** 4242)"
  },
  {
    id: "INV-2023002",
    date: "Mar 1, 2025",
    amount: 899,
    status: "Successful",
    method: "Credit Card (**** 4242)"
  },
  {
    id: "INV-2023003",
    date: "Feb 1, 2025",
    amount: 499,
    status: "Successful",
    method: "PayPal"
  }
];

const Subscriptions = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = React.useState(2);
  
  const handleSubscribe = (planId) => {
    setCurrentPlan(planId);
    toast({
      title: "Subscription Updated",
      description: `You're now subscribed to the ${SubscriptionPlans.find(plan => plan.id === planId).title}`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Monthly Ride Passes</h1>
              <p className="text-muted-foreground">
                Subscribe to monthly ride passes for discounted rates and special benefits.
              </p>
            </div>
            {currentPlan && (
              <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                <Check className="h-3.5 w-3.5 mr-1" />
                Active Subscription
              </Badge>
            )}
          </div>
          
          <Tabs defaultValue="plans" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>
          
            <TabsContent value="plans">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SubscriptionPlans.map((plan) => (
                  <Card key={plan.id} className={`flex flex-col ${plan.popular ? 'border-primary' : ''} relative`}>
                    {plan.popular && (
                      <div className="absolute -top-3 right-4">
                        <Badge className="bg-primary text-white hover:bg-primary/80">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className={`${plan.popular ? 'bg-primary/5' : ''} rounded-t-lg`}>
                      <CardTitle className="flex items-center justify-between">
                        {plan.title}
                      </CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pt-6">
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
                            <Check className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="pt-4">
                      {currentPlan === plan.id ? (
                        <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled>
                          Current Plan
                        </Button>
                      ) : (
                        <Button 
                          className="w-full" 
                          variant={plan.popular ? "default" : "outline"}
                          onClick={() => handleSubscribe(plan.id)}
                        >
                          {currentPlan ? 'Switch Plan' : 'Subscribe Now'}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment History
                  </CardTitle>
                  <CardDescription>
                    View your subscription payment history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 bg-muted/50 p-4 text-sm font-medium">
                      <div>Invoice</div>
                      <div>Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div>Payment Method</div>
                    </div>
                    <div className="divide-y">
                      {paymentHistory.map((payment) => (
                        <div key={payment.id} className="grid grid-cols-5 items-center p-4 text-sm">
                          <div className="font-medium">{payment.id}</div>
                          <div>{payment.date}</div>
                          <div>₹{payment.amount}</div>
                          <div>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {payment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center">
                            <CreditCard className="h-3.5 w-3.5 mr-2 text-gray-500" />
                            {payment.method}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              How Monthly Passes Work
            </h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Choose a subscription plan that fits your needs.</li>
              <li>Complete the payment to activate your subscription.</li>
              <li>Your rides will be automatically deducted from your monthly quota.</li>
              <li>Track your remaining rides in the app dashboard.</li>
              <li>Unused rides expire at the end of the 30-day period.</li>
            </ol>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;
