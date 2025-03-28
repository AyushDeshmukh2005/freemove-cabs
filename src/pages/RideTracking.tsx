
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getRideById, startRideUpdates, stopRideUpdates, cancelRide, Ride } from '@/services/rideService';
import { MapPin, Navigation, Phone, Clock, MessageSquare, AlertTriangle, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';

const RideTracking = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rideId) {
      navigate('/dashboard');
      return;
    }
    
    const fetchRide = async () => {
      try {
        const rideData = await getRideById(rideId);
        if (!rideData) {
          toast({
            title: "Ride Not Found",
            description: "The requested ride could not be found.",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }
        
        setRide(rideData);
        
        // Start location updates if ride is ongoing
        if (rideData.status === 'accepted' || rideData.status === 'ongoing') {
          startRideUpdates(rideId, (position) => {
            setCurrentLocation(position);
          });
        } else if (rideData.status === 'completed') {
          setShowRating(true);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load ride information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRide();
    
    // Clean up on unmount
    return () => {
      stopRideUpdates();
    };
  }, [rideId, navigate, toast]);

  const handleCancelRide = async () => {
    if (!ride) return;
    
    try {
      const success = await cancelRide(ride.id);
      if (success) {
        toast({
          title: "Ride Cancelled",
          description: "Your ride has been cancelled successfully.",
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Cannot Cancel",
          description: "This ride can no longer be cancelled.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel the ride.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitRating = async () => {
    // In a real app, this would call an API to save the rating
    toast({
      title: "Thank You!",
      description: "Your rating has been submitted.",
    });
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
        <div className="max-w-xl mx-auto bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ride Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The requested ride could not be found.</p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="bg-gocabs-primary hover:bg-gocabs-primary/90"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (showRating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
        <div className="max-w-xl mx-auto bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Rate Your Ride
          </h2>
          
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="mx-1 focus:outline-none"
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                </button>
              ))}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300">
              {rating === 5 ? 'Excellent!' : 
               rating === 4 ? 'Great ride!' :
               rating === 3 ? 'It was okay' :
               rating === 2 ? 'Not so good' :
                             'Poor experience'}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex mb-2">
                <MapPin className="h-5 w-5 text-gocabs-primary mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  From: {ride.startLocation.address}
                </span>
              </div>
              
              <div className="flex">
                <Navigation className="h-5 w-5 text-gocabs-primary mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  To: {ride.endLocation.address}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Fare:</span>
                <span className="font-medium text-gray-800 dark:text-white">${ride.fare.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Payment Method:</span>
                <span className="font-medium text-gray-800 dark:text-white capitalize">{ride.paymentMethod}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Button 
              onClick={handleSubmitRating}
              className="w-full bg-gocabs-primary hover:bg-gocabs-primary/90"
            >
              Submit Rating
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
      <div className="max-w-xl mx-auto bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {ride.status === 'pending' ? 'Finding your driver...' :
           ride.status === 'accepted' ? 'Driver is on the way' :
           ride.status === 'ongoing' ? 'Ride in progress' :
           'Ride completed'}
        </h2>
        
        {/* Map placeholder - in a real app, this would be an actual map */}
        <div 
          ref={mapRef}
          className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg mb-6 flex items-center justify-center"
        >
          {currentLocation ? (
            <div>
              <p className="text-center text-gray-500 dark:text-gray-400">
                {ride.status === 'accepted' ? 'Driver is approaching' : 'En route to destination'}
              </p>
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm">
                Location: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Map will display here</p>
          )}
        </div>
        
        {/* Ride status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Ride Status</span>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
              ride.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' :
              ride.status === 'accepted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500' :
              ride.status === 'ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500' :
              ride.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
            }`}>
              {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
            </span>
          </div>
          
          {ride.estimatedArrival && (ride.status === 'pending' || ride.status === 'accepted') && (
            <div className="flex items-center mb-2">
              <Clock className="h-4 w-4 text-gocabs-primary mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Estimated arrival: {new Date(ride.estimatedArrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          )}
        </div>
        
        {/* Ride details */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
          <div className="flex mb-2">
            <MapPin className="h-5 w-5 text-gocabs-primary mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
              From: {ride.startLocation.address}
            </span>
          </div>
          
          <div className="flex">
            <Navigation className="h-5 w-5 text-gocabs-primary mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
              To: {ride.endLocation.address}
            </span>
          </div>
        </div>
        
        {/* Driver info (only shown after a driver has been assigned) */}
        {ride.driverId && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 rounded-full bg-gocabs-primary/20 flex items-center justify-center mr-3">
                {/* In a real app, this would be the driver's profile picture */}
                <span className="text-gocabs-primary font-medium">D</span>
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">Driver Name</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Toyota Prius • 4.9 ★</p>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                <Phone className="h-4 w-4 mr-2" /> Call
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" /> Message
              </Button>
            </div>
          </div>
        )}
        
        {/* Ride fare */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Fare:</span>
            <span className="font-medium text-gray-800 dark:text-white">${ride.fare.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Distance:</span>
            <span className="font-medium text-gray-800 dark:text-white">{ride.distance} km</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-300">Payment Method:</span>
            <span className="font-medium text-gray-800 dark:text-white capitalize">{ride.paymentMethod}</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div>
          {(ride.status === 'pending' || ride.status === 'accepted') && (
            <Button 
              variant="outline"
              className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
              onClick={handleCancelRide}
            >
              <AlertTriangle className="h-4 w-4 mr-2" /> Cancel Ride
            </Button>
          )}
          
          {ride.status === 'ongoing' && (
            <Button 
              variant="outline"
              className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/10"
              onClick={() => {
                toast({
                  title: "Emergency Contact Notified",
                  description: "Emergency services have been notified of your situation.",
                });
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" /> Emergency SOS
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideTracking;
