
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { negotiateRideFare } from '@/services/negotiationService';

interface FareNegotiationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rideId: string;
  userId: string;
  currentFare: number;
  onSuccess?: () => void;
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
  const [proposedFare, setProposedFare] = useState<number>(currentFare * 0.9);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (proposedFare <= 0) {
      toast({
        title: 'Invalid fare',
        description: 'Please enter a valid fare amount',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await negotiateRideFare({
        rideId,
        userId,
        userOffer: proposedFare
      });
      
      toast({
        title: 'Negotiation Submitted',
        description: 'Your fare proposal has been sent to the driver',
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Failed to submit',
        description: 'There was an error submitting your proposal',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Negotiate Fare</DialogTitle>
          <DialogDescription>
            Propose a different fare for this ride. The driver can accept, reject, or counter your offer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current-fare">Current Fare</Label>
            <Input
              id="current-fare"
              value={formatCurrency(currentFare)}
              disabled
              className="bg-gray-100"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="proposed-fare">Your Proposed Fare</Label>
            <Input
              id="proposed-fare"
              type="number"
              value={proposedFare}
              onChange={(e) => setProposedFare(parseFloat(e.target.value))}
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">Message to Driver (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Explain why you're proposing this fare..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Send Proposal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FareNegotiationDialog;
