
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../src/components/ui/button';
import { useAuth } from '../../src/context/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16">
      <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your <span className="text-primary">Ride</span>, Your <span className="text-primary">Control</span>
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
              GoCabs gives you unprecedented control over your ride experience. Negotiate fares, customize your journey, and travel with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {user ? (
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              ) : (
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Get Started
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/placeholder.svg" 
                  alt="GoCabs App" 
                  className="w-full h-auto"
                  style={{ minHeight: '300px' }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <p className="font-medium">4.8/5 Rider Satisfaction</p>
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
