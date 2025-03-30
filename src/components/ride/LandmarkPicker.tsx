
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Landmark, landmarkService } from '@/services/landmarkService';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';

interface LandmarkPickerProps {
  onSelect: (landmark: Landmark) => void;
  placeholder?: string;
}

const LandmarkPicker = ({ onSelect, placeholder = "Search for a landmark..." }: LandmarkPickerProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInitialLandmarks = async () => {
      setIsLoading(true);
      try {
        const nearbyLandmarks = await landmarkService.getAllLandmarks();
        setLandmarks(nearbyLandmarks.slice(0, 5)); // Just show the first 5 for initial state
      } catch (error) {
        console.error("Error fetching landmarks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchInitialLandmarks();
    }
  }, [isOpen]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await landmarkService.searchLandmarks(searchQuery);
      setLandmarks(results);
      
      if (results.length === 0) {
        toast({
          title: "No landmarks found",
          description: "Try a different search term",
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Error searching for landmarks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (landmark: Landmark) => {
    onSelect(landmark);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start text-left font-normal"
        >
          <MapPin className="h-4 w-4 mr-2 text-gocabs-primary" />
          {placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4 pb-2">
          <div className="flex space-x-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search landmarks..."
              className="text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="py-2 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center p-4">
              <p className="text-sm text-gray-500">Loading landmarks...</p>
            </div>
          ) : landmarks.length > 0 ? (
            landmarks.map((landmark) => (
              <div 
                key={landmark.id}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                onClick={() => handleSelect(landmark)}
              >
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mt-0.5 mr-2 text-gocabs-primary" />
                  <div>
                    <p className="text-sm font-medium">{landmark.name}</p>
                    <p className="text-xs text-gray-500">{landmark.address}</p>
                    {landmark.description && (
                      <p className="text-xs text-gray-400 mt-0.5">{landmark.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center p-4">
              <p className="text-sm text-gray-500">No landmarks found</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LandmarkPicker;
