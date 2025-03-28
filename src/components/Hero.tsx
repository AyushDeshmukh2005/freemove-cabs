
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Star, Leaf } from 'lucide-react';

const Hero = () => {
  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-white to-gray-50 dark:from-gocabs-secondary dark:to-gocabs-dark">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8">
            <h1 className="heading-1 mb-6 animate-fade-in">
              Your Ride, <span className="gradient-text">Your Way</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              GoCabs brings you a modern, eco-friendly ride experience with AI-optimized routes, personalized themes, and rewards for both riders and drivers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-white">
                Book a Ride
              </Button>
              <Button variant="outline" className="border-2 border-gocabs-primary text-gocabs-primary hover:bg-gocabs-primary/10">
                Become a Driver
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center">
                <div className="mr-2 p-2 bg-gocabs-primary/10 rounded-full">
                  <MapPin className="h-5 w-5 text-gocabs-primary" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Real-time tracking</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 p-2 bg-gocabs-primary/10 rounded-full">
                  <Navigation className="h-5 w-5 text-gocabs-primary" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Smart routes</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 p-2 bg-gocabs-primary/10 rounded-full">
                  <Star className="h-5 w-5 text-gocabs-primary" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Top-rated drivers</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 p-2 bg-gocabs-primary/10 rounded-full">
                  <Leaf className="h-5 w-5 text-gocabs-primary" />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">Eco-friendly options</span>
              </div>
            </div>
          </div>
          
          {/* Image/Illustration */}
          <div className="w-full md:w-1/2 animate-scale-in">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gocabs-primary/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gocabs-accent/10 rounded-full blur-3xl"></div>
              
              {/* Mockup of the app with a map and a car */}
              <div className="relative z-10 bg-white dark:bg-gocabs-secondary/80 rounded-3xl shadow-xl p-4 max-w-sm mx-auto">
                <div className="bg-gray-100 dark:bg-gocabs-dark/90 rounded-xl overflow-hidden h-96 relative">
                  {/* Stylized Map */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                    <div className="text-center p-6">
                      <div className="inline-block p-3 rounded-full bg-gocabs-primary text-white mb-4">
                        <Navigation className="h-6 w-6" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Your ride is on the way
                      </p>
                      <div className="mt-4 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                        <div className="bg-gocabs-primary h-2.5 rounded-full w-2/3"></div>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Arriving in 3 minutes
                      </p>
                    </div>
                  </div>
                  
                  {/* App UI Elements */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gocabs-dark p-4 rounded-t-xl shadow-lg">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-gocabs-primary/20 flex items-center justify-center mr-3">
                        <Car className="h-5 w-5 text-gocabs-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">Eco Sedan</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Toyota Prius • 4.9 ★</p>
                      </div>
                      <div className="ml-auto">
                        <span className="font-bold text-gocabs-secondary dark:text-white">$12.50</span>
                      </div>
                    </div>
                    <Button className="w-full bg-gocabs-primary">Track Ride</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
