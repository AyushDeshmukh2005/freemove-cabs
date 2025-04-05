
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Shield, Zap, Clock, Calendar, CreditCard } from 'lucide-react';

const Subscriptions = () => {
  const { toast } = useToast();
  const [activePlan, setActivePlan] = useState<string | null>('basic');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Essential features for occasional riders',
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: 'Standard ride matching', included: true },
        { name: 'In-app navigation', included: true },
        { name: 'Basic ride history', included: true },
        { name: 'Email support', included: true },
        { name: 'Priority driver matching', included: false },
        { name: 'Discounted rates', included: false },
        { name: 'Schedule rides in advance', included: false },
        { name: '24/7 phone support', included: false },
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Enhanced features for regular commuters',
      price: { monthly: 9.99, yearly: 99.99 },
      discount: 'Save 17%',
      features: [
        { name: 'Standard ride matching', included: true },
        { name: 'In-app navigation', included: true },
        { name: 'Detailed ride history', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Priority driver matching', included: true },
        { name: '5% discount on all rides', included: true },
        { name: 'Schedule rides in advance', included: true },
        { name: '24/7 phone support', included: false },
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Ultimate experience for frequent travelers',
      price: { monthly: 19.99, yearly: 199.99 },
      discount: 'Save 17%',
      features: [
        { name: 'Standard ride matching', included: true },
        { name: 'In-app navigation', included: true },
        { name: 'Detailed ride history', included: true },
        { name: 'Priority email support', included: true },
        { name: 'VIP driver matching', included: true },
        { name: '10% discount on all rides', included: true },
        { name: 'Schedule rides in advance', included: true },
        { name: '24/7 phone support', included: true },
      ]
    }
  ];
  
  const handlePlanChange = (planId: string) => {
    toast({
      title: "Plan selected",
      description: "You've selected a new plan. Complete checkout to activate it.",
    });
    setActivePlan(planId);
  };
  
  const handleSubscribe = (planId: string) => {
    if (activePlan === planId) {
      toast({
        title: "Already subscribed",
        description: "You're already subscribed to this plan.",
      });
      return;
    }
    
    toast({
      title: "Subscription updated",
      description: `You've successfully subscribed to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
    });
    setActivePlan(planId);
  };
  
  const handleCancelSubscription = () => {
    if (activePlan === 'basic') {
      toast({
        title: "No active paid subscription",
        description: "You're currently on the Basic free plan.",
      });
      return;
    }
    
    const confirmed = window.confirm("Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.");
    if (confirmed) {
      toast({
        title: "Subscription cancelled",
        description: "Your subscription will end at the end of the current billing period.",
      });
      setActivePlan('basic');
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Subscriptions</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your subscription plans and billing
          </p>
        </div>
        
        <Tabs defaultValue="plans">
          <TabsList>
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-6 mt-4">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center p-1 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <button
                  className={`px-4 py-2 rounded-md text-sm ${
                    billingCycle === 'monthly'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm flex items-center ${
                    billingCycle === 'yearly'
                      ? 'bg-white dark:bg-gray-700 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                  <Badge className="ml-2 bg-green-500">Save 17%</Badge>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={activePlan === plan.id
                    ? "border-blue-500 shadow-md"
                    : ""
                  }
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription className="mt-1">{plan.description}</CardDescription>
                      </div>
                      {activePlan === plan.id && (
                        <Badge className="bg-blue-500">Current Plan</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-3xl font-bold">
                        ${plan.price[billingCycle].toFixed(2)}
                        <span className="text-sm text-gray-500 font-normal">
                          {plan.price[billingCycle] > 0 ? `/${billingCycle === 'monthly' ? 'mo' : 'yr'}` : ''}
                        </span>
                      </p>
                      {plan.discount && billingCycle === 'yearly' && (
                        <p className="text-green-600 text-sm mt-1">{plan.discount}</p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 mr-2" />
                          )}
                          <span className={!feature.included ? "text-gray-400" : ""}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={activePlan === plan.id ? "secondary" : "default"}
                      className="w-full"
                      onClick={() => activePlan === plan.id ? null : handleSubscribe(plan.id)}
                      disabled={activePlan === plan.id}
                    >
                      {activePlan === plan.id ? "Current Plan" : (plan.price[billingCycle] > 0 ? "Subscribe" : "Select Plan")}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium flex items-center mb-2">
                <Shield className="h-4 w-4 mr-2" />
                All plans include
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">On-demand rides</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Secure payments</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Driver ratings</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm">Ride tracking</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activePlan && activePlan !== 'basic' ? (
                  <>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{plans.find(p => p.id === activePlan)?.name} Plan</p>
                        <p className="text-sm text-gray-500">
                          Billed {billingCycle === 'monthly' ? 'monthly' : 'annually'}
                        </p>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 py-2 border-t border-b">
                      <div>
                        <p className="text-sm text-gray-500">Next billing date</p>
                        <p className="font-medium">May 15, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">
                          ${plans.find(p => p.id === activePlan)?.price[billingCycle].toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment method</p>
                        <p className="font-medium flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Visa ending in 4242
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Subscription ID</p>
                        <p className="font-medium">sub_8dfj20s9d8f3j</p>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">You are currently on the Free Basic plan.</p>
                    <Button 
                      className="mt-4"
                      onClick={() => document.querySelector('[value="plans"]')?.click()}
                    >
                      Upgrade Your Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/2025</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500">Default</Badge>
                </div>
                <Button variant="outline" className="w-full">
                  + Add Payment Method
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border-b">
                    <div>
                      <p className="font-medium">{activePlan !== 'basic' ? `${plans.find(p => p.id === activePlan)?.name} Plan` : 'Basic Plan'} - {billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</p>
                      <p className="text-xs text-gray-500">April 15, 2025</p>
                    </div>
                    <p className="font-medium">
                      ${activePlan !== 'basic' ? plans.find(p => p.id === activePlan)?.price[billingCycle].toFixed(2) : '0.00'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border-b">
                    <div>
                      <p className="font-medium">{activePlan !== 'basic' ? `${plans.find(p => p.id === activePlan)?.name} Plan` : 'Basic Plan'} - {billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</p>
                      <p className="text-xs text-gray-500">March 15, 2025</p>
                    </div>
                    <p className="font-medium">
                      ${activePlan !== 'basic' ? plans.find(p => p.id === activePlan)?.price[billingCycle].toFixed(2) : '0.00'}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center p-3">
                    <div>
                      <p className="font-medium">{activePlan !== 'basic' ? `${plans.find(p => p.id === activePlan)?.name} Plan` : 'Basic Plan'} - {billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</p>
                      <p className="text-xs text-gray-500">February 15, 2025</p>
                    </div>
                    <p className="font-medium">
                      ${activePlan !== 'basic' ? plans.find(p => p.id === activePlan)?.price[billingCycle].toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;
