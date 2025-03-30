
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Star, Route, Plus, X, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { FavoriteRoute, getFavoriteRoutes, deleteFavoriteRoute } from '@/services/rideService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface FavoriteRoutesProps {
  onSelect: (route: FavoriteRoute) => void;
}

const FavoriteRoutes = ({ onSelect }: FavoriteRoutesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [routes, setRoutes] = useState<FavoriteRoute[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<FavoriteRoute | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFavoriteRoutes = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const userRoutes = await getFavoriteRoutes(user.id);
      setRoutes(userRoutes);
    } catch (error) {
      console.error("Error loading favorite routes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavoriteRoutes();
  }, [user?.id]);

  const handleSelect = (route: FavoriteRoute) => {
    setSelectedRoute(route);
    onSelect(route);
    
    toast({
      title: "Route Selected",
      description: `Route "${route.name}" selected for booking`,
    });
  };

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setIsDeleting(true);
    try {
      await deleteFavoriteRoute(id);
      
      // Update local state
      setRoutes(prevRoutes => prevRoutes.filter(route => route.id !== id));
      
      toast({
        title: "Route Deleted",
        description: "Favorite route has been removed",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "There was an error deleting the route",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Heart className="h-5 w-5 mr-2 text-gocabs-primary" />
          Favorite Routes
        </CardTitle>
        <CardDescription>
          Quick access to your saved routes
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            <p>Loading your favorite routes...</p>
          </div>
        ) : routes.length > 0 ? (
          <div className="space-y-2">
            {routes.map((route) => (
              <div
                key={route.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedRoute?.id === route.id 
                    ? 'bg-gocabs-primary/10 border-gocabs-primary/30' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => handleSelect(route)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="font-medium text-sm">{route.name}</p>
                      {selectedRoute?.id === route.id && (
                        <Badge variant="outline" className="ml-2 text-xs">Selected</Badge>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs mr-2 mt-0.5">
                          A
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">{route.startLocation.address}</p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex items-center justify-center w-5 h-5 bg-gray-100 dark:bg-gray-700 rounded-full text-xs mr-2 mt-0.5">
                          B
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">{route.endLocation.address}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto opacity-70 hover:opacity-100"
                    onClick={(e) => handleDelete(route.id, e)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <Route className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm mb-2">No favorite routes yet</p>
            <p className="text-xs">Save your frequently used routes for quick access</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FavoriteRoutes;
