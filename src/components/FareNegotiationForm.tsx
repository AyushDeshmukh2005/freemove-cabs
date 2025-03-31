
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Ride } from '@/services/rideService';
import { Slider } from '@/components/ui/slider';
import { HandCoins, Check, X, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FareNegotiationFormProps {
  ride: Ride;
  suggestedFare: number;
  onSubmitOffer: (amount: number) => Promise<void>;
  onAcceptCounter?: (negotiationId: string) => Promise<void>;
  driverCounterOffer?: number | null;
  negotiationId?: string;
  negotiationStatus?: 'pending' | 'accepted' | 'rejected' | 'countered';
}

const FareNegotiationForm = ({
  ride,
  suggestedFare,
  onSubmitOffer,
  onAcceptCounter,
  driverCounterOffer,
  negotiationId,
  negotiationStatus
}: FareNegotiationFormProps) => {
  const { toast } = useToast();
  const [userOffer, setUserOffer] = useState(suggestedFare);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set reasonable min and max values for negotiation
  const minFare = Math.max(suggestedFare * 0.5, 1); // At least 50% of suggested or $1
  const maxFare = suggestedFare * 1.5; // Up to 150% of suggested
  
  const handleSliderChange = (value: number[]) => {
    setUserOffer(value[0]);
  };
  
  const handleOfferSubmit = async () => {
    if (userOffer < minFare) {
      toast({
        title: "Offer Too Low",
        description: `Your offer must be at least $${minFare.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmitOffer(userOffer);
      
      toast({
        title: "Offer Submitted",
        description: "Your fare offer has been sent to nearby drivers",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAcceptCounterOffer = async () => {
    if (!negotiationId || !onAcceptCounter) return;
    
    setIsSubmitting(true);
    
    try {
      await onAcceptCounter(negotiationId);
      
      toast({
        title: "Counter Offer Accepted",
        description: "You've accepted the driver's counter offer. Your ride is confirmed!",
      });
    } catch (error) {
      toast({
        title: "Acceptance Failed",
        description: "There was an error accepting the counter offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Show appropriate UI based on negotiation status
  if (negotiationStatus === 'countered' && driverCounterOffer) {
    return (
      <div className="space-y-4 border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium flex items-center">
              <HandCoins className="h-4 w-4 mr-2 text-amber-600" />
              Driver Counter Offer
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              The driver has proposed a different fare
            </p>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            Countered
          </Badge>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-amber-200 dark:border-amber-800">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Your offer</div>
            <div className="text-lg font-semibold">${userOffer.toFixed(2)}</div>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Driver's counter</div>
            <div className="text-lg font-semibold text-amber-700 dark:text-amber-400">
              ${driverCounterOffer.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="pt-2 flex space-x-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setUserOffer(driverCounterOffer)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Make New Offer
          </Button>
          
          <Button 
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            onClick={handleAcceptCounterOffer}
            disabled={isSubmitting}
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
        </div>
      </div>
    );
  }
  
  if (negotiationStatus === 'accepted') {
    return (
      <div className="space-y-2 border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/40 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center text-green-700 dark:text-green-400">
            <Check className="h-4 w-4 mr-2" />
            Offer Accepted!
          </h3>
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Confirmed
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          A driver has accepted your fare offer of ${userOffer.toFixed(2)}. Your ride is confirmed!
        </p>
      </div>
    );
  }
  
  if (negotiationStatus === 'rejected') {
    return (
      <div className="space-y-2 border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center text-red-700 dark:text-red-400">
            <X className="h-4 w-4 mr-2" />
            Offer Rejected
          </h3>
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Rejected
          </Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your fare offer was rejected. Try making a new offer or book at the standard rate.
        </p>
        <Button 
          className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setUserOffer(suggestedFare * 1.1)}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Make New Offer
        </Button>
      </div>
    );
  }
  
  // Default negotiation form
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center">
            <HandCoins className="h-4 w-4 mr-2 text-gocabs-primary" />
            Negotiate Your Fare
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Propose your price and drivers can accept or counter
          </p>
        </div>
        {negotiationStatus === 'pending' && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Pending
          </Badge>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="fare-slider">Your Offer</Label>
          <span className="text-lg font-semibold">${userOffer.toFixed(2)}</span>
        </div>
        
        <Slider
          id="fare-slider"
          min={minFare}
          max={maxFare}
          step={0.5}
          value={[userOffer]}
          onValueChange={handleSliderChange}
          className="py-4"
        />
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>${minFare.toFixed(2)}</span>
          <span>Suggested: ${suggestedFare.toFixed(2)}</span>
          <span>${maxFare.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 pt-2">
        <Input
          type="number"
          value={userOffer}
          onChange={(e) => setUserOffer(Number(e.target.value))}
          min={minFare}
          max={maxFare}
          step={0.5}
          className="flex-1"
        />
        
        <Button 
          className="bg-gocabs-primary hover:bg-gocabs-primary/90"
          onClick={handleOfferSubmit}
          disabled={isSubmitting || negotiationStatus === 'pending'}
        >
          {isSubmitting ? 'Submitting...' : (negotiationStatus === 'pending' ? 'Waiting...' : 'Submit Offer')}
        </Button>
      </div>
      
      {negotiationStatus === 'pending' && (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
          Your offer is being reviewed by nearby drivers. This may take a few minutes.
        </p>
      )}
    </div>
  );
};

export default FareNegotiationForm;
