
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getRideById, cancelRide, rateRide, changeRideDestination, addStopToRide } from '@/services/rideService';
import SplitPayment from '@/components/ride/SplitPayment';
import { MapPin, Navigation, User, Phone, Clock, AlertTriangle, Calendar, MessageSquare, Star, Ban, CheckCircle2, CircleDollarSign, Plus, Share2, Edit } from 'lucide-react';
import StopsManager from '@/components/ride/StopsManager';

const RideTracking = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [isNewDestinationOpen, setIsNewDestinationOpen] = useState(false);
  const [newDestination, setNewDestination] = useState('');
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [newStop, setNewStop] = useState('');
  const [selectedStopIndex, setSelectedStopIndex] = useState<number | null>(null);
  
  // Fetch ride data
  const { data: ride, isLoading, error, refetch } = useQuery({
    queryKey: ['ride', rideId],
    queryFn: () => getRideById(rideId as string),
    enabled: !!rideId && !!user,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load ride details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Formatted ride information for display
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'accepted':
        return 'bg-blue-500 text-white';
      case 'in_progress':
        return 'bg-green-500 text-white';
      case 'completed':
        return 'bg-purple-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Handler functions
  const handleCancel = async () => {
    if (!rideId) return;
    
    try {
      await cancelRide(rideId);
      toast({
        title: "Ride Cancelled",
        description: "Your ride has been successfully cancelled.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: "Could not cancel your ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRateRide = async () => {
    if (!rideId) return;
    
    try {
      await rateRide(rideId, ratingValue, ratingFeedback);
      toast({
        title: "Thank You!",
        description: "Your rating has been submitted successfully.",
      });
      setIsRatingOpen(false);
      refetch();
    } catch (error) {
      toast({
        title: "Rating Failed",
        description: "Could not submit your rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChangeDestination = async () => {
    if (!rideId || !newDestination) return;
    
    try {
      await changeRideDestination(rideId, newDestination);
      toast({
        title: "Destination Updated",
        description: "Your ride destination has been changed.",
      });
      setIsNewDestinationOpen(false);
      setNewDestination('');
      refetch();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update your destination. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddStop = async () => {
    if (!rideId || !newStop) return;
    
    try {
      await addStopToRide(rideId, newStop);
      toast({
        title: "Stop Added",
        description: "A new stop has been added to your ride.",
      });
      setIsAddStopOpen(false);
      setNewStop('');
      refetch();
    } catch (error) {
      toast({
        title: "Failed to Add Stop",
        description: "Could not add the stop to your ride. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Star rating component
  const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (isLoading || !ride) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gocabs-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Define compatible RideStop type
  interface RideStopWithPosition {
    id?: string;
    address: string;
    lat: number;
    lng: number;
    isCompleted?: boolean;
    order?: number;
    position?: number;
    rideId?: string;
  }

  // Convert stops to compatible format if needed
  const compatibleStops: RideStopWithPosition[] = ride.stops?.map(stop => ({
    ...stop,
    lat: stop.lat || 0,
    lng: stop.lng || 0,
    position: stop.order || 0
  })) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Ride Details
          </h1>
          <Badge className={getStatusColor(ride.status)}>
            {ride.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ride Information</CardTitle>
            <CardDescription>
              Ride #{rideId} • {formatDate(ride.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Route</h3>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gocabs-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-gocabs-primary" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Pickup Location
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {ride.startLocation.address}
                    </p>
                  </div>
                </div>
                
                {compatibleStops.length > 0 && (
                  <StopsManager 
                    stops={compatibleStops} 
                    currentStopIndex={selectedStopIndex} 
                    onSelectStop={(index) => setSelectedStopIndex(index)}
                  />
                )}
                
                <div className="flex">
                  <div className="mr-3 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gocabs-primary/10 flex items-center justify-center">
                      <Navigation className="h-4 w-4 text-gocabs-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Destination
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {ride.endLocation.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Ride Details
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Distance</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {ride.distance} km
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {ride.duration} mins
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Ride Type</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {ride.rideType}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {ride.paymentMethod || "Not specified"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Price Breakdown
                </h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Base Fare</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(ride.fare * 0.8).toFixed(2)}
                    </span>
                  </li>
                  {ride.appliedDiscount && (
                    <li className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Discount</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        -${(ride.fare * ride.appliedDiscount).toFixed(2)}
                      </span>
                    </li>
                  )}
                  {ride.weatherAdjustment && (
                    <li className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Weather Adjustment</span>
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        +${(ride.fare * ride.weatherAdjustment).toFixed(2)}
                      </span>
                    </li>
                  )}
                  <li className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ${ride.fare.toFixed(2)}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {ride.driverId && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Driver Information
                </h3>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden mr-4">
                    <User className="h-12 w-12 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      John Driver
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Toyota Camry • ABC 1234
                    </p>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">4.8</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    <Phone className="h-4 w-4 mr-2" /> Contact
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {ride.status === 'completed' && !ride.isRated && (
              <Dialog open={isRatingOpen} onOpenChange={setIsRatingOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Star className="h-4 w-4 mr-2" /> Rate Ride
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rate Your Ride</DialogTitle>
                    <DialogDescription>
                      Please rate your experience with this ride.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center py-4">
                    <StarRating rating={ratingValue} setRating={setRatingValue} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feedback">Feedback (Optional)</Label>
                    <Textarea 
                      id="feedback"
                      placeholder="Share your experience..." 
                      value={ratingFeedback}
                      onChange={(e) => setRatingFeedback(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRatingOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRateRide} disabled={ratingValue === 0}>
                      Submit Rating
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {ride.status === 'completed' && (
              <SplitPayment rideId={rideId as string} fare={ride.fare} />
            )}

            {ride.status === 'pending' && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="flex-1">
                    <Ban className="h-4 w-4 mr-2" /> Cancel Ride
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will cancel your ride request.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Go Back</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCancel}>Cancel Ride</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {(ride.status === 'pending' || ride.status === 'accepted') && (
              <Dialog open={isNewDestinationOpen} onOpenChange={setIsNewDestinationOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" /> Change Destination
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Destination</DialogTitle>
                    <DialogDescription>
                      Enter the new destination for your ride.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="newDestination">New Destination</Label>
                    <Input 
                      id="newDestination"
                      placeholder="Enter new destination address" 
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewDestinationOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleChangeDestination} disabled={!newDestination}>
                      Update Destination
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {(ride.status === 'accepted' || ride.status === 'in_progress') && (
              <Dialog open={isAddStopOpen} onOpenChange={setIsAddStopOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" /> Add Stop
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Stop</DialogTitle>
                    <DialogDescription>
                      Enter the address for an additional stop on your route.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="newStop">Stop Address</Label>
                    <Input 
                      id="newStop"
                      placeholder="Enter stop address" 
                      value={newStop}
                      onChange={(e) => setNewStop(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddStopOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddStop} disabled={!newStop}>
                      Add Stop
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RideTracking;
