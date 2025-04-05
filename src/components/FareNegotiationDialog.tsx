
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { negotiateRideFare } from '@/services/negotiationService';

interface FareNegotiationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideId: string;
  userId: string;
  currentFare: number;
  onSuccess?: (negotiatedFare: number) => void;
}

const FareNegotiationDialog: React.FC<FareNegotiationDialogProps> = ({
  open,
  onOpenChange,
  rideId,
  userId,
  currentFare,
  onSuccess
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(Math.floor(currentFare * 0.9));
  const minOffer = Math.floor(currentFare * 0.7);
  const maxOffer = Math.floor(currentFare);
  
  const handleNegotiate = async () => {
    setIsLoading(true);
    
    try {
      const result = await negotiateRideFare({
        rideId,
        userId,
        userOffer: offerAmount
      });
      
      toast({
        title: "Negotiation sent",
        description: "Your fare offer has been sent to the driver."
      });
      
      if (onSuccess) {
        onSuccess(offerAmount);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Negotiation error:', error);
      toast({
        title: "Negotiation failed",
        description: "There was a problem sending your offer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Negotiate Fare</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-fare">Current Fare</Label>
            <Input id="current-fare" value={`$${currentFare.toFixed(2)}`} disabled />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="fare-offer">Your Offer</Label>
              <span className="text-sm font-medium">${offerAmount.toFixed(2)}</span>
            </div>
            <Slider
              id="fare-offer"
              min={minOffer}
              max={maxOffer}
              step={1}
              value={[offerAmount]}
              onValueChange={([value]) => setOfferAmount(value)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${minOffer.toFixed(2)}</span>
              <span>${maxOffer.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleNegotiate} disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FareNegotiationDialog;
