
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Car, CreditCard, History, Bell, Wallet, Settings, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RideBookingForm from '@/components/RideBookingForm';
import { getUserRides, Ride } from '@/services/rideService';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recentRides, setRecentRides] = useState<Ride[]>([]);

  useEffect(() => {
    const fetchRecentRides = async () => {
      if (user) {
        try {
          const rides = await getUserRides(user.id);
          setRecentRides(rides.slice(0, 3)); // Get only the 3 most recent rides
        } catch (error) {
          console.error("Error fetching recent rides:", error);
        }
      }
    };

    fetchRecentRides();
  }, [user]);

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
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
            <RideBookingForm />
            
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Account Balance</h2>
              
              <div className="p-4 bg-gocabs-primary/5 rounded-lg mb-4">
                <div className="flex items-center">
                  <Wallet className="h-6 w-6 text-gocabs-primary mr-3" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Available</span>
                    <span className="block text-2xl font-bold text-gray-800 dark:text-white">$24.50</span>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Add Money
              </Button>
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
                <Link to="/ride-history">
                  <Button variant="ghost" size="sm" className="text-sm flex items-center">
                    <History className="h-4 w-4 mr-1" /> View All
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentRides.length > 0 ? (
                  recentRides.map((ride) => (
                    <div key={ride.id} className="flex items-start p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div className="p-2 bg-gocabs-primary/10 rounded-full mr-3">
                        <Car className="h-5 w-5 text-gocabs-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                          {ride.startLocation.address.split(',')[0]} to {ride.endLocation.address.split(',')[0]}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Status: <span className="capitalize">{ride.status}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDate(ride.createdAt)}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">${ride.fare.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-2">No recent rides</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Book your first ride above!</p>
                  </div>
                )}
              </div>
              
              {recentRides.length > 0 && (
                <div className="mt-4 text-center">
                  <Link to="/ride-history">
                    <Button variant="outline" size="sm" className="text-sm">
                      View All History
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Link to="/settings/payment">
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <CreditCard className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Payment Methods</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage cards & wallet</p>
            </div>
          </Link>
          
          <Link to="/settings/trips">
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <Calendar className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Scheduled Rides</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Plan future trips</p>
            </div>
          </Link>
          
          <Link to="/settings/favorites">
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <MapPin className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Saved Places</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Home, work & more</p>
            </div>
          </Link>
          
          <Link to="/settings">
            <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <Settings className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Account Settings</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Preferences & security</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
