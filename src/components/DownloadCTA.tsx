
import { Button } from '@/components/ui/button';
import { Apple, Play } from 'lucide-react';

const DownloadCTA = () => {
  return (
    <section id="download" className="section-padding bg-gradient-to-r from-gocabs-primary to-gocabs-accent text-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of Rides?</h2>
            <p className="text-white/90 mb-8 max-w-lg">
              Download the GoCabs app today and join thousands of satisfied riders and drivers. Available on iOS and Android.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="secondary" className="bg-white hover:bg-white/90 text-gocabs-primary">
                <Apple className="mr-2 h-5 w-5" />
                App Store
              </Button>
              <Button variant="secondary" className="bg-white hover:bg-white/90 text-gocabs-primary">
                <Play className="mr-2 h-5 w-5" />
                Google Play
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              {/* Phone mockup with app */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-3 shadow-xl max-w-xs">
                <div className="rounded-2xl overflow-hidden bg-gocabs-secondary h-96 flex flex-col">
                  {/* App header */}
                  <div className="bg-gocabs-primary p-4 text-white flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-bold">GoCabs</span>
                    </div>
                    <div className="h-6 w-6 rounded-full bg-white/20"></div>
                  </div>
                  
                  {/* App content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="bg-white/10 rounded-lg p-3 mb-3">
                      <p className="text-xs text-white/60">Your next ride</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-white font-medium">Home → Office</span>
                        <span className="text-xs bg-gocabs-primary/20 text-white px-2 py-1 rounded">8:30 AM</span>
                      </div>
                    </div>
                    
                    <div className="bg-white/10 rounded-lg flex-1 p-3 mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-12 w-12 bg-gocabs-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                          <span className="text-white">GC</span>
                        </div>
                        <p className="text-white text-sm">Get a ride in minutes!</p>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-white text-gocabs-primary hover:bg-white/90">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-5 -right-5 h-20 w-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 h-24 w-24 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadCTA;
