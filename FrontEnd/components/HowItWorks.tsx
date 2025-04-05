
import React from 'react';
import { MapPin, User, Car, CreditCard } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <MapPin className="h-10 w-10 text-primary" />,
      title: "Enter Your Destination",
      description: "Tell us where you're headed, add multiple stops if needed."
    },
    {
      icon: <Car className="h-10 w-10 text-primary" />,
      title: "Choose Your Ride",
      description: "Select from various vehicle types or negotiate your fare."
    },
    {
      icon: <User className="h-10 w-10 text-primary" />,
      title: "Meet Your Driver",
      description: "Track your driver in real-time as they approach."
    },
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: "Enjoy Your Journey",
      description: "Rate your experience and pay easily through the app."
    }
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How GoCabs Works
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Getting a ride with GoCabs is easy, quick, and designed to give you full control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                {step.icon}
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-300 dark:bg-gray-700 -ml-4 transform -translate-x-1/2" />
              )}
              
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {index + 1}. {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
