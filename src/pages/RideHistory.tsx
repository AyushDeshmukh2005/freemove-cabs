
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getUserRides, Ride } from '@/services/rideService';
import { MapPin, Navigation, Calendar, Clock, Star, Download } from 'lucide-react';

const RideHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      if (!user) return;
      
      try {
        const userRides = await getUserRides(user.id);
        setRides(userRides);
      } catch (error) {
        toast({
          title: "Failed to load rides",
          description: "There was an error loading your ride history.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRides();
  }, [user, toast]);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Ride History</h1>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ride History</h1>
          
          <Link to="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
        
        {rides.length === 0 ? (
          <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-10 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">You haven't taken any rides yet.</p>
            <Link to="/dashboard">
              <Button className="bg-gocabs-primary hover:bg-gocabs-primary/90">Book Your First Ride</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride.id} className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="mb-3 md:mb-0">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {ride.startLocation.address.split(',')[0]} to {ride.endLocation.address.split(',')[0]}
                    </h3>
                    
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                        {formatDate(ride.createdAt)}
                      </span>
                      
                      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime(ride.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full mr-4 ${getStatusColor(ride.status)}`}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </span>
                    
                    <span className="font-semibold text-gray-800 dark:text-white">
                      ${ride.fare.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-4">
                  <div className="flex mb-2">
                    <MapPin className="h-5 w-5 text-gocabs-primary mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      From: {ride.startLocation.address}
                    </span>
                  </div>
                  
                  <div className="flex">
                    <Navigation className="h-5 w-5 text-gocabs-primary mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      To: {ride.endLocation.address}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center mb-3 sm:mb-0">
                    {ride.driverRating ? (
                      <div className="flex items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Your rating:</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= ride.driverRating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      ride.status === 'completed' && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Not yet rated</span>
                      )
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    {ride.status === 'completed' && (
                      <Button variant="outline" size="sm" className="text-xs">
                        <Download className="h-3 w-3 mr-1" /> Invoice
                      </Button>
                    )}
                    
                    <Link to={`/ride/${ride.id}`}>
                      <Button size="sm" className="bg-gocabs-primary hover:bg-gocabs-primary/90 text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistory;
