import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Navigation, UserCheck, Clock, Star, Share2, PhoneCall, MessageSquare, VolumeX, Briefcase, Music } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';

// Mock ride data structure
interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface RideStop {
  address: string;
  lat?: number;
  lng?: number;
  isCompleted?: boolean;
}

interface Ride {
  id: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  startLocation: Location;
  endLocation: Location;
  stops?: RideStop[];
  distance: number;
  duration: number;
  fare: number;
  driverId?: string;
  rideType: 'standard' | 'premium' | 'eco';
  paymentMethod?: 'card' | 'cash' | 'wallet';
  createdAt: Date;
  updatedAt: Date;
  nearbyLandmark?: string;
  isNegotiable?: boolean;
  isShared?: boolean;
  rideMood?: 'chatty' | 'quiet' | 'music' | 'work';
  weatherAdjustment?: number;
  appliedDiscount?: number;
  userRating?: number;
  isRated?: boolean;
}

// Mock API call function
const getRideById = async (rideId: string): Promise<Ride | null> => {
  // This would be an actual API call in a real app
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: rideId,
        status: 'in_progress',
        startLocation: {
          address: '123 Main St, San Francisco, CA',
          lat: 37.7749,
          lng: -122.4194
        },
        endLocation: {
          address: '456 Market St, San Francisco, CA',
          lat: 37.7922,
          lng: -122.3987
        },
        stops: [
          {
            address: '789 Mission St, San Francisco, CA',
            isCompleted: true
          }
        ],
        distance: 5.2,
        duration: 15,
        fare: 25.50,
        driverId: 'driver123',
        rideType: 'standard',
        paymentMethod: 'card',
        createdAt: new Date(),
        updatedAt: new Date(),
        nearbyLandmark: 'Coffee Shop',
        isNegotiable: false,
        isShared: false,
        rideMood: 'quiet',
        weatherAdjustment: 0,
        appliedDiscount: 0,
        isRated: false
      });
    }, 500);
  });
};

// Mock cancel ride function
const cancelRide = async (rideId: string): Promise<Ride> => {
  // This would be an actual API call in a real app
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: rideId,
        status: 'cancelled',
        startLocation: {
          address: '123 Main St, San Francisco, CA',
          lat: 37.7749,
          lng: -122.4194
        },
        endLocation: {
          address: '456 Market St, San Francisco, CA',
          lat: 37.7922,
          lng: -122.3987
        },
        distance: 5.2,
        duration: 15,
        fare: 25.50,
        rideType: 'standard',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }, 500);
  });
};

// Mock rate ride function
const rateRide = async (rideId: string, rating: number, comment: string): Promise<void> => {
  // This would be an actual API call in a real app
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};

const RideTracking = () => {
  const { rideId } = useParams<{ rideId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number} | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  
  // Set up ride fetch
  useEffect(() => {
    const fetchRide = async () => {
      if (!rideId) return;
      
      try {
        const rideData = await getRideById(rideId);
        if (rideData) {
          setRide(rideData);
        } else {
          toast({
            title: "Ride Not Found",
            description: "Could not find the ride you're looking for.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "There was an error fetching ride details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRide();
    
    // Clean up any intervals
    return () => {
      clearInterval(window.setInterval());
    };
  }, [rideId, toast, navigate]);
  
  // Set up ride status updates
  useEffect(() => {
    if (ride && ['accepted', 'in_progress'].includes(ride.status)) {
      // Start ride updates with a polling interval
      const updateInterval = setInterval(() => {
        // Simulate position updates
        setCurrentPosition({
          lat: Math.random() * 0.01 + 37.7749,
          lng: Math.random() * 0.01 - 122.4194
        });
        
        // In a real app, we would update the ride status here
      }, 5000);
      
      return () => {
        clearInterval(updateInterval);
      };
    }
    
    if (ride && ride.status === 'completed' && !ride.isRated) {
      setShowRating(true);
    }
  }, [ride]);
  
  const handleCancelRide = async () => {
    if (!ride) return;
    
    if (window.confirm('Are you sure you want to cancel this ride?')) {
      try {
        const updatedRide = await cancelRide(ride.id);
        
        toast({
          title: "Ride Cancelled",
          description: "Your ride has been cancelled successfully.",
        });
        
        setRide(updatedRide);
      } catch (error) {
        toast({
          title: "Cancellation Failed",
          description: "This ride cannot be cancelled at this time.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleRateRide = async () => {
    if (!ride || selectedRating === 0) return;
    
    setIsSubmittingRating(true);
    
    try {
      await rateRide(ride.id, selectedRating, "");
      
      toast({
        title: "Thanks for Rating",
        description: "Your feedback helps us improve our service.",
      });
      
      setShowRating(false);
      
      // Refresh ride data
      const updatedRide = await getRideById(ride.id);
      if (updatedRide) {
        setRide({...updatedRide, isRated: true});
      }
    } catch (error) {
      toast({
        title: "Rating Failed",
        description: "There was an error submitting your rating.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingRating(false);
    }
  };
  
  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'chatty':
        return <div className="p-1 rounded-full bg-blue-100 text-blue-600"><MessageSquare className="h-4 w-4" /></div>;
      case 'quiet':
        return <div className="p-1 rounded-full bg-purple-100 text-purple-600"><VolumeX className="h-4 w-4" /></div>;
      case 'work':
        return <div className="p-1 rounded-full bg-green-100 text-green-600"><Briefcase className="h-4 w-4" /></div>;
      case 'music':
        return <div className="p-1 rounded-full bg-orange-100 text-orange-600"><Music className="h-4 w-4" /></div>;
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Loading ride details...</p>
        </div>
      ) : ride ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                {ride.status === 'pending' && 'Finding your driver...'}
                {ride.status === 'accepted' && 'Driver is on the way!'}
                {ride.status === 'in_progress' && 'On the way to your destination'}
                {ride.status === 'completed' && 'Ride Completed'}
                {ride.status === 'cancelled' && 'Ride Cancelled'}
              </h1>
              
              {ride.status !== 'cancelled' && (
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {ride.status === 'pending' && 'Looking for drivers near you...'}
                  {ride.status === 'accepted' && 'Your driver will arrive shortly'}
                  {ride.status === 'in_progress' && 'Enjoy your ride to the destination'}
                  {ride.status === 'completed' && 'Thanks for riding with us!'}
                </p>
              )}
            </div>
            
            {['pending', 'accepted'].includes(ride.status) && (
              <Button variant="destructive" onClick={handleCancelRide}>
                Cancel Ride
              </Button>
            )}
            
            {ride.status === 'in_progress' && (
              <Badge className="bg-primary text-white px-3 py-1.5">
                In Progress
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ride Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-lg space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pickup</p>
                        <p className="font-medium dark:text-gray-200">{ride.startLocation.address}</p>
                        {ride.nearbyLandmark && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Near {ride.nearbyLandmark}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {ride.stops && ride.stops.length > 0 && (
                      <>
                        {ride.stops.map((stop, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                              <span className="block h-5 w-5 text-center font-medium text-gray-700 dark:text-gray-300">
                                {index + 1}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Stop {index + 1}</p>
                              <p className="font-medium dark:text-gray-200">{stop.address}</p>
                              {stop.isCompleted && (
                                <Badge variant="outline" className="mt-1 text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-200">
                                  Completed
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/20 rounded-full">
                        <Navigation className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Destination</p>
                        <p className="font-medium dark:text-gray-200">{ride.endLocation.address}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Ride Type</p>
                      <p className="font-medium dark:text-gray-200 flex items-center">
                        {ride.rideType.charAt(0).toUpperCase() + ride.rideType.slice(1)}
                        {ride.rideType === 'eco' && (
                          <Badge className="ml-2 bg-green-500 text-xs">Eco</Badge>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                      <p className="font-medium dark:text-gray-200">
                        {ride.paymentMethod?.charAt(0).toUpperCase() + ride.paymentMethod?.slice(1)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Distance</p>
                      <p className="font-medium dark:text-gray-200">{ride.distance.toFixed(1)} km</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Time</p>
                      <p className="font-medium dark:text-gray-200">{ride.duration.toFixed(0)} min</p>
                    </div>
                    
                    {ride.rideMood && (
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ride Mood</p>
                        <div className="flex items-center mt-1">
                          {getMoodIcon(ride.rideMood)}
                          <p className="font-medium dark:text-gray-200 ml-2">
                            {ride.rideMood.charAt(0).toUpperCase() + ride.rideMood.slice(1)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {showRating && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rate Your Ride</CardTitle>
                    <CardDescription>How was your experience?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Button
                          key={rating}
                          variant="ghost"
                          className={`p-2 ${selectedRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          onClick={() => setSelectedRating(rating)}
                        >
                          <Star className={`h-8 w-8 ${selectedRating >= rating ? 'fill-yellow-400' : ''}`} />
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowRating(false)}
                    >
                      Skip
                    </Button>
                    <Button 
                      onClick={handleRateRide} 
                      disabled={selectedRating === 0 || isSubmittingRating}
                    >
                      {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Driver Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {ride.driverId ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium text-lg">
                          JD
                        </div>
                        <div>
                          <p className="font-semibold">John Doe</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm ml-1">4.8</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle</p>
                        <p className="font-medium dark:text-gray-200">Toyota Camry • ABC 123</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="w-[48%]">
                          <PhoneCall className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        
                        <Button variant="outline" size="sm" className="w-[48%]">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Trip
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="mx-auto h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {ride.status === 'pending' ? 'Finding a driver...' : 'No driver assigned'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Base fare</span>
                      <span className="font-medium dark:text-white">${(ride.fare * 0.7).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Distance ({ride.distance.toFixed(1)} km)</span>
                      <span className="font-medium dark:text-white">${(ride.fare * 0.2).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Time ({ride.duration.toFixed(0)} min)</span>
                      <span className="font-medium dark:text-white">${(ride.fare * 0.1).toFixed(2)}</span>
                    </div>
                    
                    {ride.weatherAdjustment && ride.weatherAdjustment !== 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Weather adjustment</span>
                        <span className="font-medium dark:text-white">
                          {ride.weatherAdjustment > 0 ? '+' : '-'}${(Math.abs(ride.fare * ride.weatherAdjustment)).toFixed(2)}
                        </span>
                      </div>
                    )}
                    
                    {ride.appliedDiscount && ride.appliedDiscount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>Discount</span>
                        <span>-${((ride.appliedDiscount / 100) * ride.fare).toFixed(2)}</span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${ride.fare.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Link to="/ride-history">
              <Button variant="outline">View All Rides</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48">
          <p className="text-gray-500 mb-4">Ride not found</p>
          <Link to="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
};

export default RideTracking;
