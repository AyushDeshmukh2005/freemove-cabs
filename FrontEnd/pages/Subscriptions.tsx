
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, AlertTriangle, Clock, CreditCard, CalendarDays, Zap, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Subscriptions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('plans');
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('basic');
  const [paymentMethod, setPaymentMethod] = useState({
    type: 'Visa',
    last4: '4242',
    expiry: '05/25'
  });
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      interval: 'month',
      description: 'Standard ride experience with basic features',
      features: [
        'Standard rides',
        'Regular pricing',
        'Email support',
        'Basic ride tracking'
      ],
      notIncluded: [
        'Priority matching',
        'Ride discounts',
        'Premium vehicles',
        'Special events access'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      interval: 'month',
      description: 'Enhanced experience with priority and discounts',
      features: [
        'Everything in Basic',
        'Priority driver matching',
        '5% off all rides',
        'Priority customer support',
        'Advanced ride tracking'
      ],
      notIncluded: [
        'Premium vehicles',
        'Special events access'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      interval: 'month',
      description: 'VIP experience with premium vehicles and exclusives',
      features: [
        'Everything in Pro',
        'Premium vehicle access',
        '15% off all rides',
        'Free monthly ride (up to $15)',
        'Dedicated support line',
        'Special events access',
        'Family account (up to 5 members)'
      ],
      notIncluded: []
    }
  ];
  
  const handleChangePlan = (planId: string) => {
    setLoading(true);
    
    // Simulated API call
    setTimeout(() => {
      setCurrentPlan(planId);
      setLoading(false);
      
      toast({
        title: "Subscription Updated",
        description: `You have successfully switched to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      });
    }, 1500);
  };
  
  const handleChangePaymentMethod = () => {
    toast({
      title: "Coming Soon",
      description: "Payment method management will be available in a future update.",
    });
  };
  
  const handleCancelSubscription = () => {
    toast({
      title: "Are you sure?",
      description: "Please contact customer support to cancel your subscription.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-gray-500 mt-1">
            Manage your subscription plan and payment methods
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="billing">Billing & Payment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const isCurrentPlan = currentPlan === plan.id;
                
                return (
                  <Card key={plan.id} className={`${isCurrentPlan ? 'border-primary ring-2 ring-primary/20' : ''}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{plan.name}</span>
                        {isCurrentPlan && (
                          <Badge className="bg-gocabs-primary/90">Current Plan</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-baseline">
                        {plan.price === 0 ? (
                          <span className="text-2xl font-bold">Free</span>
                        ) : (
                          <>
                            <span className="text-2xl font-bold">${plan.price}</span>
                            <span className="text-sm text-muted-foreground ml-1">/{plan.interval}</span>
                          </>
                        )}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-2">
                        {plan.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-1" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                        
                        {plan.notIncluded.map((feature, i) => (
                          <div key={i} className="flex items-start opacity-50">
                            <X className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className={`w-full ${isCurrentPlan ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''}`}
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan || loading}
                        onClick={() => handleChangePlan(plan.id)}
                      >
                        {isCurrentPlan ? 'Current Plan' : loading ? 'Processing...' : 'Select Plan'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-400">Annual Discount Available</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Save 20% by switching to annual billing. Contact customer support to change your billing cycle.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </CardTitle>
                  <CardDescription>
                    Manage your payment details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-medium">{paymentMethod.type} ending in {paymentMethod.last4}</div>
                          <div className="text-sm text-gray-500">Expires {paymentMethod.expiry}</div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleChangePaymentMethod}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Billing History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between p-3 border-b">
                      <div>
                        <div className="font-medium">Pro Plan Subscription</div>
                        <div className="text-sm text-gray-500">Apr 1, 2025</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$9.99</div>
                        <div className="text-xs text-green-500">Paid</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between p-3 border-b">
                      <div>
                        <div className="font-medium">Pro Plan Subscription</div>
                        <div className="text-sm text-gray-500">Mar 1, 2025</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$9.99</div>
                        <div className="text-xs text-green-500">Paid</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between p-3 border-b">
                      <div>
                        <div className="font-medium">Pro Plan Subscription</div>
                        <div className="text-sm text-gray-500">Feb 1, 2025</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">$9.99</div>
                        <div className="text-xs text-green-500">Paid</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Cancel Subscription</CardTitle>
                  <CardDescription>
                    Please note that cancelling will end your subscription benefits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-4">
                    If you cancel, your subscription will remain active until the end of your current billing period. After that, you will be downgraded to the Basic plan.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;
