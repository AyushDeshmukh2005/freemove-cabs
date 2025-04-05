
import React from 'react';
import { 
  Tag, Clock, ArrowLeftRight, Shield, CreditCard, MessageCircle,
  MapPin, ThumbsUp, Bell, LifeBuoy, Zap, Settings
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../src/components/ui/card';

const Features = () => {
  const features = [
    {
      title: "Fare Negotiation",
      description: "Negotiate ride fares directly with drivers for the best price.",
      icon: <Tag className="h-8 w-8 text-primary" />
    },
    {
      title: "Real-Time Tracking",
      description: "Track your ride in real-time, get accurate ETAs.",
      icon: <Clock className="h-8 w-8 text-primary" />
    },
    {
      title: "Flexible Routes",
      description: "Add multiple stops and customize your journey.",
      icon: <ArrowLeftRight className="h-8 w-8 text-primary" />
    },
    {
      title: "Safety First",
      description: "Emergency contact sharing and SOS features for peace of mind.",
      icon: <Shield className="h-8 w-8 text-primary" />
    },
    {
      title: "Split Payments",
      description: "Easily split ride costs with friends and family.",
      icon: <CreditCard className="h-8 w-8 text-primary" />
    },
    {
      title: "In-App Chat",
      description: "Direct communication with your driver without phone numbers.",
      icon: <MessageCircle className="h-8 w-8 text-primary" />
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Features Designed for You
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the most innovative and user-friendly cab service with these amazing features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader className="pb-2">
                <div className="mb-2">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
