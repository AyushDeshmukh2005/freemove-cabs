
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { toast } from "../components/ui/use-toast";
import { negotiateRideFare, getRideNegotiations, acceptCounterOffer } from "../services/negotiationService";

interface NegotiationProps {
  rideId: string;
  userId: string;
  originalFare: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FareNegotiationDialog = ({ rideId, userId, originalFare, isOpen, onOpenChange }: NegotiationProps) => {
  const [userOffer, setUserOffer] = useState(Math.floor(originalFare * 0.8)); // Default offer at 80% of original
  const [dialogOpen, setDialogOpen] = useState(isOpen || false);
  
  // Fetch existing negotiations
  const { data: negotiations, isLoading, refetch } = useQuery({
    queryKey: ['negotiations', rideId],
    queryFn: () => getRideNegotiations(rideId),
    enabled: dialogOpen
  });
  
  const handleSliderChange = (value: number[]) => {
    setUserOffer(value[0]);
  };
  
  const handleNegotiate = async () => {
    try {
      await negotiateRideFare({
        rideId,
        userId,
        userOffer
      });
      
      toast({
        title: "Offer sent successfully!",
        description: `Your offer of ₹${userOffer} has been sent to nearby drivers.`,
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Failed to send offer",
        description: "There was an error submitting your fare offer. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAcceptCounter = async (negotiationId: string) => {
    try {
      await acceptCounterOffer(negotiationId);
      
      toast({
        title: "Counter offer accepted!",
        description: "You've accepted the driver's counter offer. Your ride is being processed.",
      });
      
      refetch();
      setDialogOpen(false);
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to accept offer",
        description: "There was an error accepting the counter offer. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => {
      setDialogOpen(open);
      if (onOpenChange) onOpenChange(open);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">Negotiate Fare</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Negotiate Your Ride Fare</DialogTitle>
          <DialogDescription>
            Set your preferred fare for this ride. Drivers can accept, reject, or counter your offer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="fare-slider">Your Offer</Label>
              <div className="text-2xl font-bold">₹{userOffer}</div>
            </div>
            <div className="py-4">
              <Slider
                id="fare-slider"
                defaultValue={[userOffer]}
                max={originalFare}
                min={Math.floor(originalFare * 0.5)}
                step={5}
                onValueChange={handleSliderChange}
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>Min: ₹{Math.floor(originalFare * 0.5)}</div>
              <div>Original: ₹{originalFare}</div>
            </div>
          </div>
          
          <Button onClick={handleNegotiate} className="mt-2">Submit Offer</Button>
          
          {isLoading ? (
            <div className="text-center py-4">Loading negotiations...</div>
          ) : negotiations && negotiations.length > 0 ? (
            <div className="space-y-3 mt-4">
              <h3 className="font-medium text-sm">Negotiation History</h3>
              {negotiations.map((negotiation: any) => (
                <Card key={negotiation.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {negotiation.status === 'pending' ? 'Pending' :
                           negotiation.status === 'accepted' ? 'Accepted' :
                           negotiation.status === 'rejected' ? 'Rejected' : 'Countered'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Your offer: ₹{negotiation.userOffer}
                        </div>
                        {negotiation.status === 'countered' && (
                          <div className="text-sm font-medium mt-1">
                            Counter offer: ₹{negotiation.driverCounterOffer}
                          </div>
                        )}
                      </div>
                      {negotiation.status === 'countered' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleAcceptCounter(negotiation.id)}
                        >
                          Accept
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
        
        <DialogFooter>
          <div className="text-xs text-muted-foreground w-full text-center">
            Offers expire after 10 minutes. Drivers may counter your offer with their own price.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FareNegotiationDialog;
