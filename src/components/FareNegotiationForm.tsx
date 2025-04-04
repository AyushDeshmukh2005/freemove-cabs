import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FareNegotiationFormProps {
  ride: { id: string };
  suggestedFare: number;
  onSubmitOffer: (amount: number) => void;
  onAcceptCounter: (negotiationId: string) => void;
  driverCounterOffer: number | null;
  negotiationId?: string;
  negotiationStatus?: 'pending' | 'accepted' | 'rejected' | 'countered' | undefined;
}

const FareNegotiationForm: React.FC<FareNegotiationFormProps> = ({
  ride,
  suggestedFare,
  onSubmitOffer,
  onAcceptCounter,
  driverCounterOffer,
  negotiationId,
  negotiationStatus
}) => {
  const [offerAmount, setOfferAmount] = useState(Math.floor(suggestedFare * 0.85)); // Default to 85% of suggested
  
  const handleSliderChange = (value: number[]) => {
    setOfferAmount(value[0]);
  };
  
  const handleSubmitOffer = () => {
    onSubmitOffer(offerAmount);
  };
  
  const handleAcceptCounter = () => {
    if (negotiationId) {
      onAcceptCounter(negotiationId);
    }
  };
  
  const renderNegotiationStatus = () => {
    if (!negotiationStatus) return null;
    
    switch (negotiationStatus) {
      case 'pending':
        return (
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
            <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            <AlertTitle className="text-blue-700 dark:text-blue-400">Waiting for drivers</AlertTitle>
            <AlertDescription className="text-blue-600 dark:text-blue-300 text-sm">
              Your fare offer is being shared with nearby drivers. This could take a few minutes.
            </AlertDescription>
          </Alert>
        );
      case 'rejected':
        return (
          <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
            <X className="h-4 w-4 text-red-500" />
            <AlertTitle className="text-red-700 dark:text-red-400">Offer rejected</AlertTitle>
            <AlertDescription className="text-red-600 dark:text-red-300 text-sm">
              No drivers accepted your offer. Try again with a different amount.
            </AlertDescription>
            <div className="mt-2">
              <Button onClick={() => onSubmitOffer(Math.floor(suggestedFare * 0.9))} size="sm" variant="outline" className="mr-2">
                Try with ${Math.floor(suggestedFare * 0.9)}
              </Button>
              <Button onClick={() => onSubmitOffer(suggestedFare)} size="sm">
                Book at original price (${suggestedFare})
              </Button>
            </div>
          </Alert>
        );
      case 'countered':
        return (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-700 dark:text-amber-400">Counter Offer Received!</AlertTitle>
            <AlertDescription className="text-amber-600 dark:text-amber-300 text-sm">
              A driver has proposed ${driverCounterOffer} for this ride.
            </AlertDescription>
            <div className="mt-2 flex space-x-2">
              <Button onClick={handleAcceptCounter} size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                Accept Offer
              </Button>
              <Button onClick={() => onSubmitOffer(Math.floor((driverCounterOffer || suggestedFare) * 0.95))} size="sm" variant="outline" className="border-amber-500 text-amber-600">
                Counter with ${Math.floor((driverCounterOffer || suggestedFare) * 0.95)}
              </Button>
            </div>
          </Alert>
        );
      case 'accepted':
        return (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700 dark:text-green-400">Offer Accepted!</AlertTitle>
            <AlertDescription className="text-green-600 dark:text-green-300 text-sm">
              A driver has accepted your fare offer. You saved ${(suggestedFare - offerAmount).toFixed(2)}.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };
  
  // If there's an active negotiation, show its status
  if (negotiationStatus) {
    return renderNegotiationStatus();
  }
  
  // Otherwise, show the negotiation form
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="fare-offer">Your Offer</Label>
          <Badge className="bg-green-500">Save up to {Math.round((1 - (offerAmount / suggestedFare)) * 100)}%</Badge>
        </div>
        <div className="flex space-x-3 items-center">
          <div className="flex-1">
            <Slider
              id="fare-offer"
              defaultValue={[offerAmount]}
              min={Math.floor(suggestedFare * 0.6)}
              max={suggestedFare}
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>
          <div className="w-20">
            <Input 
              type="number" 
              value={offerAmount} 
              onChange={e => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= Math.floor(suggestedFare * 0.6) && value <= suggestedFare) {
                  setOfferAmount(value);
                }
              }}
              className="text-right"
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Min: ${Math.floor(suggestedFare * 0.6)}</span>
          <span>Suggested: ${suggestedFare}</span>
        </div>
      </div>
      <Button onClick={handleSubmitOffer} className="w-full">Submit Offer</Button>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        You can negotiate the fare directly with nearby drivers.
      </p>
    </div>
  );
};

export default FareNegotiationForm;
