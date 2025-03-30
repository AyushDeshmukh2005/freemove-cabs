
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, Star, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { FavoriteDriver, getFavoriteDrivers, deleteFavoriteDriver } from '@/services/rideService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';

interface FavoriteDriversProps {
  onSelect: (driverId: string) => void;
  selectedDriverId?: string;
}

const FavoriteDrivers = ({ onSelect, selectedDriverId }: FavoriteDriversProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<FavoriteDriver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock driver details since we don't have a real driver database
  // In a real app, we would fetch this information from a drivers database
  const mockDriverNames = [
    "John Davis", "Alice Smith", "Robert Johnson", 
    "Emily Brown", "Michael Wilson", "Sarah Taylor"
  ];
  
  const getDriverName = (driverId: string) => {
    // Use the last 6 chars of the driverId as an index
    const index = parseInt(driverId.slice(-6), 36) % mockDriverNames.length;
    return mockDriverNames[Math.abs(index)];
  };

  const loadFavoriteDrivers = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const userDrivers = await getFavoriteDrivers(user.id);
      setDrivers(userDrivers);
    } catch (error) {
      console.error("Error loading favorite drivers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteDrivers();
  }, [user?.id]);

  const handleSelect = (driverId: string) => {
    onSelect(driverId);
    
    toast({
      title: "Driver Selected",
      description: "We'll try to match you with this driver",
    });
  };

  const handleRemoveDriver = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await deleteFavoriteDriver(id);
      
      // Update local state
      setDrivers(prevDrivers => prevDrivers.filter(driver => driver.id !== id));
      
      toast({
        title: "Driver Removed",
        description: "Driver removed from favorites",
      });
    } catch (error) {
      toast({
        title: "Remove Failed",
        description: "There was an error removing the driver",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Star className="h-5 w-5 mr-2 text-gocabs-primary" />
          Favorite Drivers
        </CardTitle>
        <CardDescription>
          Select from your preferred drivers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">
            <p>Loading your favorite drivers...</p>
          </div>
        ) : drivers.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {drivers.map((driver) => {
              const driverName = getDriverName(driver.driverId);
              const initials = driverName.split(' ').map(n => n[0]).join('');
              const isSelected = selectedDriverId === driver.driverId;
              
              return (
                <div
                  key={driver.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-gocabs-primary/10 border-gocabs-primary/30' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => handleSelect(driver.driverId)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gocabs-primary/20 text-gocabs-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{driverName}</p>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-3 w-3 ${
                              star <= 4 + Math.floor(Math.random() * 2) 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-gocabs-primary" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-2">No favorite drivers yet</p>
            <p className="text-xs">Your favorite drivers will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteDrivers;
