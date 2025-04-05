
import React from 'react';
import { Apple, Play } from 'lucide-react';
import { Button } from '../../src/components/ui/button';

const DownloadCTA = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4">
              Download the GoCabs App
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-lg">
              Get the full GoCabs experience with our mobile app. Book rides, negotiate fares, track your journey, and more — all from your phone.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" size="lg" className="gap-2">
                <Apple />
                <div className="flex flex-col items-start">
                  <span className="text-xs">Download on the</span>
                  <span className="text-sm font-medium">App Store</span>
                </div>
              </Button>
              
              <Button variant="secondary" size="lg" className="gap-2">
                <Play />
                <div className="flex flex-col items-start">
                  <span className="text-xs">GET IT ON</span>
                  <span className="text-sm font-medium">Google Play</span>
                </div>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="relative">
              <img 
                src="/placeholder.svg" 
                alt="GoCabs App Screenshot" 
                className="max-w-[250px] rounded-3xl shadow-2xl"
                style={{ height: '480px', objectFit: 'cover' }}
              />
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded-full transform rotate-12">
                New!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
