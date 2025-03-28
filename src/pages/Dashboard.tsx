
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Car, CreditCard, History, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleBookRide = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Ride booked!",
        description: "Your ride has been booked successfully.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark">
      {/* Header */}
      <header className="bg-white dark:bg-gocabs-secondary shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gocabs-primary">GoCabs</h1>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gocabs-secondary/50">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gocabs-primary/20 flex items-center justify-center text-gocabs-primary font-medium">
                  {user?.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:inline-block">
                  {user?.name}
                </span>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
                className="text-sm"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Book a Ride</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300">Pickup Location</label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <MapPin className="h-5 w-5 text-gocabs-primary mr-2" />
                    <input 
                      type="text" 
                      placeholder="Enter pickup location" 
                      className="bg-transparent outline-none w-full text-gray-800 dark:text-gray-200 text-sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-300">Destination</label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <Navigation className="h-5 w-5 text-gocabs-primary mr-2" />
                    <input 
                      type="text" 
                      placeholder="Enter destination" 
                      className="bg-transparent outline-none w-full text-gray-800 dark:text-gray-200 text-sm"
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90"
                    onClick={handleBookRide}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Finding Rides...' : 'Book Now'}
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Ride Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Eco-Friendly Mode</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gocabs-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Shared Rides</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gocabs-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Premium Vehicles</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gocabs-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Live Map</h2>
              
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Map will be displayed here</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
              
              <div className="space-y-4">
                <div className="flex items-start p-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="p-2 bg-gocabs-primary/10 rounded-full mr-3">
                    <Car className="h-5 w-5 text-gocabs-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">Downtown Ride</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">From: Home • To: Downtown</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Yesterday, 5:30 PM</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">$12.50</span>
                  </div>
                </div>
                
                <div className="flex items-start p-3 border-b border-gray-100 dark:border-gray-700">
                  <div className="p-2 bg-gocabs-primary/10 rounded-full mr-3">
                    <CreditCard className="h-5 w-5 text-gocabs-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">Added to Wallet</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Payment Method: Credit Card</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 days ago, 10:15 AM</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">$25.00</span>
                  </div>
                </div>
                
                <div className="flex items-start p-3">
                  <div className="p-2 bg-gocabs-primary/10 rounded-full mr-3">
                    <History className="h-5 w-5 text-gocabs-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white">Airport Trip</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">From: Home • To: Airport</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last week, 8:00 AM</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">$35.75</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm" className="text-sm">
                  View All History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
