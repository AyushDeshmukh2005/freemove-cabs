
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNegotiation } from '../services/negotiationService';
import { Button } from '../../src/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../src/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Label } from '../../src/components/ui/label';
import { Slider } from '../../src/components/ui/slider';
import { useToast } from '../../src/hooks/use-toast';

interface FareNegotiationDialogProps {
  rideId: string;
  initialFare: number;
  onComplete?: (status: string, amount: number) => void;
}

const FareNegotiationDialog: React.FC<FareNegotiationDialogProps> = ({
  rideId,
  initialFare,
  onComplete
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isNegotiating, setIsNegotiating] = useState<boolean>(false);
  const [negotiatedFare, setNegotiatedFare] = useState<number>(Math.round(initialFare * 0.9)); // Start with 10% discount

  // Set min and max values for negotiation
  const minFare = Math.round(initialFare * 0.7); // Minimum 70% of original fare
  const maxFare = initialFare;
  
  const handleSubmitNegotiation = async () => {
    setIsNegotiating(true);
    
    try {
      const response = await createNegotiation(rideId, negotiatedFare);
      
      toast({
        title: "Negotiation Submitted",
        description: "Your fare offer has been sent to the driver.",
      });
      
      setIsOpen(false);
      if (onComplete) {
        onComplete("submitted", negotiatedFare);
      }
    } catch (error) {
      toast({
        title: "Negotiation Failed",
        description: "Unable to submit your fare offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNegotiating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Negotiate Fare</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Negotiate Your Fare</DialogTitle>
          <DialogDescription>
            Suggest a new fare for this ride. The driver can accept, decline, or counter-offer.
          </DialogDescription>
        </DialogHeader>
        
        <Card className="border-none shadow-none">
          <CardHeader className="p-0">
            <CardTitle className="text-lg">Original Fare: ${initialFare.toFixed(2)}</CardTitle>
            <CardDescription>Your offer: ${negotiatedFare.toFixed(2)}</CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>${minFare.toFixed(2)}</span>
                  <span>${maxFare.toFixed(2)}</span>
                </div>
                <Slider
                  value={[negotiatedFare]}
                  min={minFare}
                  max={maxFare}
                  step={1}
                  onValueChange={(value) => setNegotiatedFare(value[0])}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitNegotiation}
            disabled={isNegotiating}
          >
            {isNegotiating ? "Submitting..." : "Submit Offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FareNegotiationDialog;
