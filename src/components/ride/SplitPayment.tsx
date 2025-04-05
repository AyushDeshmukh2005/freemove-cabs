
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Clipboard, Mail, BadgePercent } from 'lucide-react';
import { generateSplitPaymentLink } from '@/services/rideService';

type SplitPaymentProps = {
  rideId: string;
  currentFare: number;
};

const SplitPayment = ({ rideId, currentFare }: SplitPaymentProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [email, setEmail] = useState('');

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    try {
      const result = await generateSplitPaymentLink(rideId);
      setPaymentLink(result.link);
      setAmount(result.amount);
      
      toast({
        title: "Link Generated",
        description: "Split payment link has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate payment link.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      toast({
        title: "Copied",
        description: "Link copied to clipboard."
      });
    }
  };

  const handleShare = () => {
    if (!email || !paymentLink) return;
    
    // Mock sending email
    toast({
      title: "Link Shared",
      description: `Payment request sent to ${email}`,
    });
    
    setEmail('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BadgePercent className="h-5 w-5 mr-2" />
          Split Payment
        </CardTitle>
        <CardDescription>Share the ride cost with others</CardDescription>
      </CardHeader>

      <CardContent>
        {!paymentLink ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Generate a link to share with friends to split the cost of this ride.
            </p>
            <Button onClick={handleGenerateLink} disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Split Payment Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Payment link:</p>
              <div className="flex items-center">
                <Input value={paymentLink} readOnly className="flex-1" />
                <Button variant="outline" size="icon" className="ml-2" onClick={handleCopyLink}>
                  <Clipboard className="h-4 w-4" />
                </Button>
              </div>
              {amount && (
                <p className="text-sm mt-1">
                  Amount: ${amount.toFixed(2)} ({(amount / currentFare * 100).toFixed(0)}% of total)
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Label htmlFor="email">Share via email</Label>
              <div className="flex mt-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                />
                <Button className="ml-2" size="sm" onClick={handleShare} disabled={!email}>
                  <Mail className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SplitPayment;
