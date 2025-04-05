
import React from 'react';
import { 
  ShieldCheck, Coins, Clock, MessageCircle, Heart, Award
} from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: <ShieldCheck className="h-12 w-12 text-primary" />,
      title: "Safety Guaranteed",
      description: "Background-checked drivers, emergency assistance, and real-time ride tracking give you peace of mind."
    },
    {
      icon: <Coins className="h-12 w-12 text-primary" />,
      title: "Cost Effective",
      description: "Fare negotiation and transparent pricing ensure you always get the best value for your rides."
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: "Time Efficient",
      description: "Quick driver matching, optimized routes, and traffic-aware navigation save you precious time."
    },
    {
      icon: <MessageCircle className="h-12 w-12 text-primary" />,
      title: "Easy Communication",
      description: "Built-in chat allows seamless communication with your driver without sharing personal details."
    },
    {
      icon: <Heart className="h-12 w-12 text-primary" />,
      title: "Personalized Experience",
      description: "Save favorite routes and drivers for a ride experience tailored to your preferences."
    },
    {
      icon: <Award className="h-12 w-12 text-primary" />,
      title: "Loyalty Rewards",
      description: "Earn points with every ride and redeem them for discounts and special perks."
    }
  ];

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Benefits of Choosing GoCabs
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Experience a ride-hailing service that puts you first with these exclusive benefits.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
