
// Just fixing the specific type error in the file
// This is a partial update focusing on line 92 that has the Promise<number> type error

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Navigation, Car, Leaf, Shield, Percent, Users, Calendar, Clock, HandCoins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  bookRide, 
  calculateRoute, 
  calculateFare, 
  FavoriteRoute, 
  saveFavoriteRoute,
  getFavoriteRoutes
} from '@/services/rideService';
import { weatherService } from '@/services/weatherService';
import { Landmark, landmarkService } from '@/services/landmarkService';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import LandmarkPicker from './ride/LandmarkPicker';
import RideMoodSelector from './ride/RideMoodSelector';
import FavoriteRoutes from './ride/FavoriteRoutes';
import FavoriteDrivers from './ride/FavoriteDrivers';
import NearbyEvents from './ride/NearbyEvents';
import FareNegotiationForm from './FareNegotiationForm';
import { createNegotiation, acceptCounterOffer, makeCounterOffer, getNegotiationById, getRideNegotiations, NegotiationRequest } from '@/services/negotiationService';

const RideBookingForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Basic ride inputs
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState<'standard' | 'premium' | 'eco'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'wallet'>('cash');
  
  // Additional options
  const [rideMood, setRideMood] = useState<'chatty' | 'quiet' | 'work' | 'music' | undefined>(undefined);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [selectedFavoritedDriverId, setSelectedFavoritedDriverId] = useState<string | undefined>(undefined);
  const [additionalStops, setAdditionalStops] = useState<string[]>([]);
  const [returnTime, setReturnTime] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [weatherCondition, setWeatherCondition] = useState<string>('clear');
  
  // Fare calculation
  const [fareEstimate, setFareEstimate] = useState<number | null>(null);
  const [showEstimate, setShowEstimate] = useState(false);
  const [originalFare, setOriginalFare] = useState<number | null>(null);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [weatherAdjustment, setWeatherAdjustment] = useState(0);
  
  // Negotiation-related state
  const [enableNegotiation, setEnableNegotiation] = useState(false);
  const [negotiationId, setNegotiationId] = useState<string | undefined>(undefined);
  const [negotiationStatus, setNegotiationStatus] = useState<'pending' | 'accepted' | 'rejected' | 'countered' | undefined>(undefined);
  const [driverCounterOffer, setDriverCounterOffer] = useState<number | null>(null);
  
  // Form state
  const [activeTab, setActiveTab] = useState('basic');
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState('');
  const [tempRideId, setTempRideId] = useState<string | null>(null);

  // Get the current weather when the component mounts
  useEffect(() => {
    const getWeather = async () => {
      if (pickupLocation) {
        try {
          const condition = await weatherService.getCurrentWeather(pickupLocation);
          setWeatherCondition(condition);
          
          // Fix the type error by awaiting the Promise
          const adjustment = await weatherService.getPriceAdjustmentForWeather(condition);
          setWeatherAdjustment(adjustment);
        } catch (error) {
          console.error("Error fetching weather:", error);
        }
      }
    };
    
    getWeather();
  }, [pickupLocation]);

  // Check for negotiation updates if there's an active negotiation
  useEffect(() => {
    if (!negotiationId) return;
    
    const checkNegotiationStatus = async () => {
      try {
        const negotiation = await getNegotiationById(negotiationId);
        
        if (negotiation && negotiation.status !== negotiationStatus) {
          setNegotiationStatus(negotiation.status);
          
          if (negotiation.status === 'countered' && negotiation.driverCounterOffer) {
            setDriverCounterOffer(negotiation.driverCounterOffer);
          }
        }
      } catch (error) {
        console.error("Error checking negotiation status:", error);
      }
    };
    
    const intervalId = setInterval(checkNegotiationStatus, 3000);
    
    return () => clearInterval(intervalId);
  }, [negotiationId, negotiationStatus]);

  const calculateEstimate = async () => {
    if (pickupLocation && destination) {
      const { distance, duration } = calculateRoute(pickupLocation, destination, additionalStops);
      
      // Store the standard fare for comparison
      const standardFare = calculateFare(distance, duration, 'standard');
      setOriginalFare(standardFare);
      
      // Calculate fare based on selected ride type and weather
      const estimatedFare = calculateFare(distance, duration, rideType, false, 0, weatherCondition);
      setFareEstimate(estimatedFare);
      
      // Set discount flag if eco ride
      setDiscountApplied(rideType === 'eco');
      
      // Generate a temporary ride ID for negotiation flow
      setTempRideId(`temp_${Math.random().toString(36).substring(2, 15)}`);
      
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
      // Prepare options for booking
      const bookingOptions: any = {
        rideMood,
        favoritedDriverId: selectedFavoritedDriverId
      };
      
      // Add stops if any
      if (additionalStops.length > 0) {
        bookingOptions.stops = additionalStops;
      }
      
      // Add landmark if selected
      if (selectedLandmark) {
        bookingOptions.nearbyLandmark = selectedLandmark.name;
      }
      
      // Use negotiated fare if negotiation is accepted
      const finalFare = negotiationStatus === 'accepted' && driverCounterOffer 
        ? driverCounterOffer 
        : (negotiationStatus === 'accepted' ? fareEstimate : null);
      
      const ride = await bookRide(
        user.id,
        pickupLocation,
        destination,
        rideType,
        paymentMethod,
        bookingOptions,
        finalFare
      );
      
      toast({
        title: "Ride Booked!",
        description: "We are searching for a driver near you.",
      });
      
      // Check if user wants to save this as a favorite route
      if (ride) {
        // Navigate to the ride tracking page
        navigate(`/ride/${ride.id}`);
      }
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

  const handleAddStop = () => {
    if (newStop.trim()) {
      setAdditionalStops([...additionalStops, newStop.trim()]);
      setNewStop('');
      
      // Recalculate fare if already shown
      if (showEstimate) {
        calculateEstimate();
      }
      
      toast({
        title: "Stop Added",
        description: "Additional stop added to your route.",
      });
    }
  };

  const handleRemoveStop = (index: number) => {
    const updatedStops = [...additionalStops];
    updatedStops.splice(index, 1);
    setAdditionalStops(updatedStops);
    
    // Recalculate fare if already shown
    if (showEstimate) {
      calculateEstimate();
    }
  };

  const handleSelectFavoriteRoute = (route: FavoriteRoute) => {
    setPickupLocation(route.startLocation.address);
    setDestination(route.endLocation.address);
    
    // Recalculate fare
    setTimeout(() => {
      calculateEstimate();
    }, 100);
  };

  const handleLandmarkSelect = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setPickupLocation(landmark.address);
    
    toast({
      title: "Landmark Selected",
      description: `Pickup set to "${landmark.name}"`,
    });
  };

  const handleSaveAsFavorite = async () => {
    if (!user?.id || !pickupLocation || !destination) return;
    
    try {
      const name = `${pickupLocation.split(',')[0]} to ${destination.split(',')[0]}`;
      await saveFavoriteRoute(
        user.id,
        name,
        { 
          address: pickupLocation, 
          lat: Math.random() * 180 - 90, 
          lng: Math.random() * 360 - 180 
        },
        { 
          address: destination, 
          lat: Math.random() * 180 - 90, 
          lng: Math.random() * 360 - 180 
        }
      );
      
      toast({
        title: "Route Saved",
        description: "Added to your favorite routes",
      });
    } catch (error) {
      console.error("Error saving favorite route:", error);
      toast({
        title: "Save Failed",
        description: "Could not save route as favorite",
        variant: "destructive",
      });
    }
  };

  const handleSubmitNegotiation = async (amount: number) => {
    if (!user || !tempRideId) return;
    
    try {
      const negotiation = await createNegotiation(tempRideId, user.id, amount);
      setNegotiationId(negotiation.id);
      setNegotiationStatus('pending');
      
      // Update fare estimate to show the user's offer
      setFareEstimate(amount);
    } catch (error) {
      console.error("Error creating negotiation:", error);
      toast({
        title: "Negotiation Failed",
        description: "Could not submit your fare offer",
        variant: "destructive",
      });
    }
  };

  const handleAcceptCounterOffer = async (id: string) => {
    if (!driverCounterOffer) return;
    
    try {
      const success = await acceptCounterOffer(id);
      
      if (success) {
        setNegotiationStatus('accepted');
        setFareEstimate(driverCounterOffer);
      }
    } catch (error) {
      console.error("Error accepting counter offer:", error);
      toast({
        title: "Acceptance Failed",
        description: "Could not accept the counter offer",
        variant: "destructive",
      });
    }
  };

  const renderWeatherBadge = () => {
    if (!weatherCondition) return null;
    
    const color = weatherAdjustment > 0 ? 'bg-amber-500/10 text-amber-600 border-amber-200' : 'bg-blue-500/10 text-blue-600 border-blue-200';
    const text = weatherAdjustment > 0 
      ? `${(weatherAdjustment * 100).toFixed(0)}% surge due to ${weatherCondition} weather` 
      : `${Math.abs(weatherAdjustment * 100).toFixed(0)}% discount on ${weatherCondition} day`;
    
    return (
      <Badge variant="outline" className={color}>
        {text}
      </Badge>
    );
  };

  return (
    <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Book a Ride</h2>
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="options">Options</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="basic" className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label className="text-sm text-gray-600 dark:text-gray-300">Pickup Location</Label>
            <div className="flex space-x-2">
              <div className="flex-1">
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
              <LandmarkPicker onSelect={handleLandmarkSelect} placeholder="Use landmark" />
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
          
          {additionalStops.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-gray-600 dark:text-gray-300">Additional Stops</Label>
              <div className="space-y-2">
                {additionalStops.map((stop, index) => (
                  <div key={index} className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-center h-5 w-5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs mr-2">
                      {index + 1}
                    </div>
                    <span className="flex-1 text-sm">{stop}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveStop(index)}
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                      >
                        <path
                          d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                          fill="currentColor"
                        />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {showAddStop ? (
            <div className="flex space-x-2">
              <Input
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                placeholder="Enter stop location"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddStop();
                  }
                }}
              />
              <Button onClick={handleAddStop}>Add</Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowAddStop(false);
                  setNewStop('');
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setShowAddStop(true)}
            >
              + Add Stop
            </Button>
          )}
          
          <div className="space-y-2">
            <Label className="text-sm text-gray-600 dark:text-gray-300">Ride Type</Label>
            <RadioGroup 
              value={rideType} 
              onValueChange={(value: 'standard' | 'premium' | 'eco') => {
                setRideType(value);
                if (showEstimate) {
                  calculateEstimate(); // Recalculate fare when ride type changes
                }
              }}
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
              
              <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-3 relative">
                <RadioGroupItem value="eco" id="eco" />
                <Label htmlFor="eco" className="flex items-center cursor-pointer">
                  <Leaf className="h-5 w-5 text-green-500 mr-2" />
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">Eco-Friendly</p>
                      <Badge className="ml-2 bg-green-500 text-xs">10% OFF</Badge>
                    </div>
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
        </TabsContent>
        
        <TabsContent value="options" className="space-y-4 mt-2">
          <div className="flex items-center space-x-2 border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20 p-3 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium flex items-center">
                <HandCoins className="h-4 w-4 mr-2 text-amber-600" />
                Enable Fare Negotiation
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Propose your own fare and negotiate with drivers
              </p>
            </div>
            <Switch 
              checked={enableNegotiation} 
              onCheckedChange={setEnableNegotiation}
            />
          </div>
          
          <RideMoodSelector 
            selectedMood={rideMood}
            onMoodSelect={(mood) => setRideMood(mood as any)}
          />
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="scheduled">
              <AccordionTrigger className="py-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Schedule for Later</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Pickup Time</Label>
                    <Input
                      id="schedule-time"
                      type="datetime-local"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                    />
                  </div>
                  {scheduleTime && (
                    <div className="bg-gocabs-primary/10 p-3 rounded-lg text-sm">
                      Your ride will be scheduled for {new Date(scheduleTime).toLocaleString()}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          {destination && (
            <NearbyEvents 
              location={destination}
              onSelectReturnTime={(time) => setReturnTime(time)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4 mt-2">
          <FavoriteRoutes onSelect={handleSelectFavoriteRoute} />
          
          <FavoriteDrivers 
            onSelect={(driverId) => setSelectedFavoritedDriverId(driverId)}
            selectedDriverId={selectedFavoritedDriverId}
          />
        </TabsContent>
        
        {showEstimate && fareEstimate !== null && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">Estimated Fare:</span>
              <div className="text-right">
                {(discountApplied || weatherAdjustment !== 0) && originalFare && (
                  <div className="flex items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-through mr-2">${originalFare.toFixed(2)}</span>
                    {discountApplied && (
                      <Badge className="bg-green-500 text-xs font-normal mr-1">
                        <Percent className="h-3 w-3 mr-1" /> 10% ECO DISCOUNT
                      </Badge>
                    )}
                    {weatherAdjustment !== 0 && renderWeatherBadge()}
                  </div>
                )}
                <span className="font-semibold text-gray-800 dark:text-white">${fareEstimate.toFixed(2)}</span>
              </div>
            </div>
            
            {enableNegotiation && tempRideId && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <FareNegotiationForm 
                  ride={{ id: tempRideId } as any}
                  suggestedFare={fareEstimate}
                  onSubmitOffer={handleSubmitNegotiation}
                  onAcceptCounter={handleAcceptCounterOffer}
                  driverCounterOffer={driverCounterOffer}
                  negotiationId={negotiationId}
                  negotiationStatus={negotiationStatus}
                />
              </div>
            )}
            
            {returnTime && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Return ride scheduled:</span>
                  </div>
                  <span className="font-medium">{returnTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            )}
            
            {rideType !== 'premium' && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                  <Users className="h-3 w-3 mr-1" />
                  <span>You may get ride sharing suggestions for additional discounts</span>
                </div>
              </div>
            )}
            
            {user && pickupLocation && destination && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="link" 
                  size="sm" 
                  className="px-0 h-auto text-xs text-gocabs-primary"
                  onClick={handleSaveAsFavorite}
                >
                  Save as favorite route
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-4 flex space-x-3">
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
            disabled={isLoading || !pickupLocation || !destination || (enableNegotiation && negotiationStatus === 'pending')}
          >
            {isLoading ? 'Finding Rides...' : (scheduleTime ? 'Schedule Ride' : 'Book Now')}
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default RideBookingForm;
