
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Car, CreditCard, History, Bell, Wallet, Settings, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserRides, Ride } from '@/services/rideService';
import DashboardLayout from '@/components/DashboardLayout';
import RideBookingForm from '@/components/RideBookingForm';

const Dashboard = () => {
  const { user } = useAuth();
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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Sidebar */}
        <div className="md:col-span-1">
          <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Book a Ride</CardTitle>
              <CardDescription>Enter your details to book a cab</CardDescription>
            </CardHeader>
            <CardContent>
              <RideBookingForm />
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Account Balance</CardTitle>
              <CardDescription>Your current wallet balance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gocabs-primary/5 rounded-lg mb-4">
                <div className="flex items-center">
                  <Wallet className="h-6 w-6 text-gocabs-primary mr-3" />
                  <div>
                    <span className="block text-sm text-gray-500 dark:text-gray-400">Available</span>
                    <span className="block text-2xl font-bold text-gray-800 dark:text-white">$24.50</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Add Money
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          <Card className="mb-6 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Live Map</CardTitle>
              <CardDescription>See available cabs around you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Map will be displayed here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Your latest rides</CardDescription>
              </div>
              <Link to="/ride-history">
                <Button variant="ghost" size="sm" className="text-sm flex items-center">
                  <History className="h-4 w-4 mr-1" /> View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRides.length > 0 ? (
                  recentRides.map((ride) => (
                    <div key={ride.id} className="flex items-start p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/20 rounded-md transition-colors">
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
            </CardContent>
            {recentRides.length > 0 && (
              <CardFooter>
                <Link to="/ride-history" className="w-full">
                  <Button variant="outline" size="sm" className="text-sm w-full">
                    View All History
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Link to="/settings/payment" className="block">
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <CreditCard className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Payment Methods</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage cards & wallet</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/settings/trips" className="block">
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <Calendar className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Scheduled Rides</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Plan future trips</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/settings/favorites" className="block">
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <MapPin className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Saved Places</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Home, work & more</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/settings" className="block">
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-2">
                <Settings className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-sm font-medium text-gray-800 dark:text-white">Account Settings</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Preferences & security</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
