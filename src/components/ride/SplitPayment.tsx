
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Copy, Check, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSplitPaymentLink } from '@/services/rideService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface SplitPaymentProps {
  rideId: string;
  currentFare: number;
}

interface SplitPaymentResult {
  link: string;
  amount: number;
}

const SplitPayment = ({ rideId, currentFare }: SplitPaymentProps) => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [splitAmount, setSplitAmount] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    
    try {
      const result = await generateSplitPaymentLink(rideId);
      
      if (typeof result === 'string') {
        setPaymentLink(result);
        setSplitAmount(currentFare / numberOfPeople);
      } else if (result && typeof result === 'object') {
        // Handle if result is an object with link and amount properties
        setPaymentLink(result.link);
        setSplitAmount(result.amount || (currentFare / numberOfPeople));
      }
      
      toast({
        title: "Payment Link Generated",
        description: "You can now share this link with your co-passengers.",
      });
    } catch (error) {
      toast({
        title: "Failed to Generate Link",
        description: "There was an error generating the payment link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      setCopied(true);
      
      toast({
        title: "Link Copied",
        description: "Payment link copied to clipboard.",
      });
      
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Users className="h-5 w-5 mr-2 text-gocabs-primary" />
          Split Payment
        </CardTitle>
        <CardDescription>
          Easily split your fare with friends
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!paymentLink ? (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-sm mb-1">Number of people</label>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNumberOfPeople(prev => Math.max(2, prev - 1))}
                >
                  -
                </Button>
                <span className="w-8 text-center">{numberOfPeople}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setNumberOfPeople(prev => Math.min(10, prev + 1))}
                >
                  +
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg">
              <div className="flex justify-between items-center text-sm mb-1">
                <span>Total fare:</span>
                <span className="font-medium">${currentFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Each person pays:</span>
                <span className="font-medium">${(currentFare / numberOfPeople).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/30 p-3 rounded-lg">
              <p className="text-sm mb-2">Each person pays:</p>
              <p className="text-xl font-bold text-gocabs-primary">${splitAmount.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <div className="flex-1 px-3 py-2 overflow-hidden">
                <p className="text-sm truncate">{paymentLink}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-full rounded-none border-l border-gray-200 dark:border-gray-700"
                onClick={handleCopyLink}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {!paymentLink ? (
          <Button 
            onClick={handleGenerateLink} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate Split Link'}
          </Button>
        ) : (
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => {
                setPaymentLink(null);
                setSplitAmount(0);
              }}
            >
              Reset
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                // In a real app, this would use the Web Share API
                // or a similar sharing mechanism
                toast({
                  title: "Sharing Payment Link",
                  description: "Opening share dialog...",
                });
                // navigator.share would be used here in a real app
              }}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default SplitPayment;
