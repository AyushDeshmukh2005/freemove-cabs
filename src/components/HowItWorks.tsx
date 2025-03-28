
import { MapPin, Car, CreditCard } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <MapPin className="h-6 w-6" />,
      title: "Set your location",
      description: "Enter your pickup and drop-off locations or use GPS to automatically detect where you are."
    },
    {
      number: "02",
      icon: <Car className="h-6 w-6" />,
      title: "Match with a driver",
      description: "Our system matches you with the nearest available driver based on your requirements."
    },
    {
      number: "03",
      icon: <CreditCard className="h-6 w-6" />,
      title: "Enjoy your ride & pay",
      description: "Track your ride in real-time and pay seamlessly through your preferred payment method."
    }
  ];

  return (
    <section id="how-it-works" className="section-padding">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="heading-2 mb-4">How GoCabs <span className="gradient-text">Works</span></h2>
          <p className="text-gray-600 dark:text-gray-300">
            Getting a ride with GoCabs is simple, fast, and convenient. Just follow these three easy steps.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {steps.map((step, index) => (
            <div key={index} className="w-full md:w-1/3 relative animate-fade-in" style={{ animationDelay: `${0.2 * index}s` }}>
              {/* Step Number */}
              <div className="absolute -top-5 -left-5 text-7xl font-bold text-gray-100 dark:text-gray-800 z-0">
                {step.number}
              </div>
              
              {/* Step Card */}
              <div className="feature-card relative z-10 h-full">
                <div className="inline-flex items-center justify-center p-3 rounded-lg bg-gocabs-primary/10 text-gocabs-primary mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gocabs-secondary dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
              
              {/* Connector - only between steps, not after the last one */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full">
                  <div className="w-8 h-0.5 bg-gocabs-primary/30"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile App Preview */}
        <div className="mt-20 bg-gray-50 dark:bg-gocabs-secondary/30 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center">
            {/* Text Content */}
            <div className="w-full md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h3 className="heading-3 mb-4">Experience the App</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Download the GoCabs app to access all features including real-time tracking, fare estimates, ride history, and exclusive promotions.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-gocabs-primary/10 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-gocabs-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Faster booking with saved addresses</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-gocabs-primary/10 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-gocabs-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Exclusive in-app discounts and offers</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-gocabs-primary/10 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-gocabs-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">24/7 in-app customer support</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 p-1 bg-gocabs-primary/10 rounded-full mr-3 mt-1">
                    <svg className="h-4 w-4 text-gocabs-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Customize app theme and appearance</span>
                </li>
              </ul>
            </div>
            
            {/* App Screenshot/Mockup */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-gocabs-accent/10 rounded-full blur-3xl"></div>
                <div className="bg-white dark:bg-gocabs-dark/80 rounded-3xl shadow-lg p-3 max-w-xs relative z-10">
                  {/* App UI Mockup */}
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
                    {/* App Header */}
                    <div className="p-4 bg-gocabs-primary text-white">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 mr-2" />
                        <span className="font-medium">GoCabs</span>
                      </div>
                    </div>
                    
                    {/* App Content */}
                    <div className="p-4">
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-4 shadow-sm">
                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">Current Location</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">123 Main Street</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-4 shadow-sm">
                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">Destination</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">456 Market Avenue</p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-4 shadow-sm">
                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">Available Rides</p>
                        <div className="flex justify-between items-center mt-2 pb-2 border-b border-gray-100 dark:border-gray-600">
                          <div className="flex items-center">
                            <Car className="h-4 w-4 text-gocabs-primary mr-2" />
                            <span className="text-sm">Economy</span>
                          </div>
                          <span className="text-sm font-medium">$12.50</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 pb-2 border-b border-gray-100 dark:border-gray-600">
                          <div className="flex items-center">
                            <Car className="h-4 w-4 text-gocabs-accent mr-2" />
                            <span className="text-sm">Comfort</span>
                          </div>
                          <span className="text-sm font-medium">$18.75</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <Leaf className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm">Eco</span>
                          </div>
                          <span className="text-sm font-medium">$14.25</span>
                        </div>
                      </div>
                      
                      <button className="w-full bg-gocabs-primary text-white rounded-lg py-2 text-sm font-medium">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
