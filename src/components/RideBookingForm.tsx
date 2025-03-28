
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Navigation, Car, Leaf, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { bookRide, calculateRoute, calculateFare } from '@/services/rideService';
import { useNavigate } from 'react-router-dom';

const RideBookingForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState<'standard' | 'premium' | 'eco'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  
  const [fareEstimate, setFareEstimate] = useState<number | null>(null);
  const [showEstimate, setShowEstimate] = useState(false);

  const calculateEstimate = () => {
    if (pickupLocation && destination) {
      const { distance, duration } = calculateRoute(pickupLocation, destination);
      const estimatedFare = calculateFare(distance, duration, rideType);
      setFareEstimate(estimatedFare);
      setShowEstimate(true);
    } else {
      toast({
        title: "Missing Information",
        description: "Please enter both pickup location and destination.",
        variant: "destructive",
      });
    }
  };

  const handleBookRide = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to book a ride.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!pickupLocation || !destination) {
      toast({
        title: "Missing Information",
        description: "Please enter both pickup location and destination.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const ride = await bookRide(
        user.id,
        pickupLocation,
        destination,
        rideType,
        paymentMethod
      );
      
      toast({
        title: "Ride Booked!",
        description: "We are searching for a driver near you.",
      });
      
      // Navigate to the ride tracking page
      navigate(`/ride/${ride.id}`);
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error booking your ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Book a Ride</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-600 dark:text-gray-300">Pickup Location</Label>
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <MapPin className="h-5 w-5 text-gocabs-primary mr-2" />
            <Input 
              type="text" 
              placeholder="Enter pickup location" 
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm text-gray-600 dark:text-gray-300">Destination</Label>
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3">
            <Navigation className="h-5 w-5 text-gocabs-primary mr-2" />
            <Input 
              type="text" 
              placeholder="Enter destination" 
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm text-gray-600 dark:text-gray-300">Ride Type</Label>
          <RadioGroup 
            value={rideType} 
            onValueChange={(value: 'standard' | 'premium' | 'eco') => setRideType(value)}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="flex items-center cursor-pointer">
                <Car className="h-5 w-5 text-gocabs-primary mr-2" />
                <div>
                  <p className="font-medium">Standard</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Affordable, everyday rides</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <RadioGroupItem value="premium" id="premium" />
              <Label htmlFor="premium" className="flex items-center cursor-pointer">
                <Shield className="h-5 w-5 text-gocabs-primary mr-2" />
                <div>
                  <p className="font-medium">Premium</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">High-end vehicles with top-rated drivers</p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <RadioGroupItem value="eco" id="eco" />
              <Label htmlFor="eco" className="flex items-center cursor-pointer">
                <Leaf className="h-5 w-5 text-gocabs-primary mr-2" />
                <div>
                  <p className="font-medium">Eco-Friendly</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Electric or hybrid vehicles for lower emissions</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm text-gray-600 dark:text-gray-300">Payment Method</Label>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={(value: 'cash' | 'card' | 'wallet') => setPaymentMethod(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cash" id="cash" />
              <Label htmlFor="cash" className="font-normal">Cash</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="font-normal">Card</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="wallet" id="wallet" />
              <Label htmlFor="wallet" className="font-normal">Wallet</Label>
            </div>
          </RadioGroup>
        </div>
        
        {showEstimate && fareEstimate !== null && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Estimated Fare:</span>
              <span className="font-semibold text-gray-800 dark:text-white">${fareEstimate.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        <div className="pt-2 flex space-x-3">
          <Button 
            variant="outline"
            className="flex-1"
            onClick={calculateEstimate}
            disabled={!pickupLocation || !destination}
          >
            Get Estimate
          </Button>
          
          <Button 
            className="flex-1 bg-gocabs-primary hover:bg-gocabs-primary/90"
            onClick={handleBookRide}
            disabled={isLoading || !pickupLocation || !destination}
          >
            {isLoading ? 'Finding Rides...' : 'Book Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideBookingForm;
