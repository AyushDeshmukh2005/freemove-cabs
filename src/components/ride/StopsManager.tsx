
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus, X, Map } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { RideStop, addStopToRide, changeRideDestination } from '@/services/rideService';

interface StopsManagerProps {
  rideId: string;
  currentStops?: RideStop[];
  currentDestination: string;
  onStopAdded: () => void;
  onDestinationChanged: () => void;
}

const StopsManager = ({
  rideId,
  currentStops = [],
  currentDestination,
  onStopAdded,
  onDestinationChanged
}: StopsManagerProps) => {
  const { toast } = useToast();
  const [newStop, setNewStop] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [isChangingDestination, setIsChangingDestination] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddStop = async () => {
    if (!newStop) {
      toast({
        title: "Missing Information",
        description: "Please enter a stop location.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addStopToRide(rideId, newStop);
      
      toast({
        title: "Stop Added",
        description: "New stop added to your ride.",
      });
      
      setNewStop('');
      setIsAddingStop(false);
      onStopAdded();
    } catch (error) {
      toast({
        title: "Failed to Add Stop",
        description: "There was an error adding your stop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeDestination = async () => {
    if (!newDestination) {
      toast({
        title: "Missing Information",
        description: "Please enter a new destination.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await changeRideDestination(rideId, newDestination);
      
      toast({
        title: "Destination Changed",
        description: "Your ride destination has been updated.",
      });
      
      setNewDestination('');
      setIsChangingDestination(false);
      onDestinationChanged();
    } catch (error) {
      toast({
        title: "Failed to Change Destination",
        description: "There was an error updating your destination. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Route Details</h3>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setIsAddingStop(!isAddingStop);
              setIsChangingDestination(false);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Stop
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setIsChangingDestination(!isChangingDestination);
              setIsAddingStop(false);
            }}
          >
            <Map className="h-4 w-4 mr-1" />
            Change Destination
          </Button>
        </div>
      </div>
      
      {isAddingStop && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                placeholder="Enter stop location"
                className="text-sm"
              />
            </div>
            <Button 
              size="sm" 
              onClick={handleAddStop} 
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add'}
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setIsAddingStop(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {isChangingDestination && (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                placeholder="Enter new destination"
                className="text-sm"
              />
            </div>
            <Button 
              size="sm" 
              onClick={handleChangeDestination} 
              disabled={isLoading}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setIsChangingDestination(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {/* Current stops list */}
        {currentStops.map((stop, index) => (
          <div 
            key={index} 
            className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full text-xs">
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm">{stop.address}</p>
            </div>
            {stop.isCompleted && (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200">
                Completed
              </Badge>
            )}
          </div>
        ))}
        
        {/* Final destination */}
        <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-lg">
          <div className="flex items-center justify-center w-6 h-6 bg-gocabs-primary/80 text-white rounded-full">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm">{currentDestination}</p>
          </div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200">
            Destination
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default StopsManager;
