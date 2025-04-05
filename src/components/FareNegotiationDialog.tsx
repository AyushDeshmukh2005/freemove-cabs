
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { createNegotiation, acceptCounterOffer, NegotiationRequest } from '@/services/negotiationService';

interface FareNegotiationDialogProps {
  open: boolean;
  onClose: () => void;
  rideId: string;
  estimatedFare: number;
  onNegotiationCreated: (negotiationId: string) => void;
}

const FareNegotiationDialog = ({
  open,
  onClose,
  rideId,
  estimatedFare,
  onNegotiationCreated,
}: FareNegotiationDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(Math.floor(estimatedFare * 0.9));
  const minOffer = Math.floor(estimatedFare * 0.7);
  const maxOffer = Math.ceil(estimatedFare * 1.1);
  
  const handleSliderChange = (value: number[]) => {
    setOfferAmount(value[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setOfferAmount(value);
    }
  };
  
  const handleSubmitOffer = async () => {
    if (!user) return;
    setIsLoading(true);
    
    try {
      const negotiation = await createNegotiation(rideId, user.id, offerAmount.toString());
      onNegotiationCreated(negotiation.id);
      
      toast({
        title: "Offer submitted",
        description: "Your fare offer has been sent to available drivers.",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your offer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    onClose();
  };
  
  const discount = (((estimatedFare - offerAmount) / estimatedFare) * 100).toFixed(1);
  const isDiscount = offerAmount < estimatedFare;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Negotiate Fare</DialogTitle>
          <DialogDescription>
            Propose your own fare for this ride. Drivers can accept or counter your offer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="fare">Your offer</Label>
              <span className={`text-sm font-medium ${isDiscount ? 'text-green-600' : 'text-amber-600'}`}>
                {isDiscount ? `-${discount}%` : `+${Math.abs(parseFloat(discount))}%`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">$</span>
              <Input
                id="fare"
                type="number"
                value={offerAmount}
                onChange={handleInputChange}
                className="flex-1"
              />
            </div>
            <Slider
              defaultValue={[offerAmount]}
              value={[offerAmount]}
              min={minOffer}
              max={maxOffer}
              step={0.5}
              onValueChange={handleSliderChange}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${minOffer.toFixed(2)}</span>
              <span>Estimated: ${estimatedFare.toFixed(2)}</span>
              <span>${maxOffer.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isDiscount
                ? "Lower offers may take longer to be accepted by drivers."
                : "Higher offers may get you a ride faster with premium service."}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmitOffer} disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FareNegotiationDialog;
