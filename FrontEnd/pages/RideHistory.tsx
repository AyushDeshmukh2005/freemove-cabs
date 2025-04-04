
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../components/ui/pagination';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, Car, MapPin, Clock } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { getUserRides, Ride } from '../services/rideService';
import DashboardLayout from '../components/DashboardLayout';

const statusColor = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  inProgress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const RideHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rides, setRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ridesPerPage = 5;

  useEffect(() => {
    const fetchRides = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const fetchedRides = await getUserRides(user.id);
          setRides(fetchedRides);
        } catch (error) {
          console.error("Error fetching rides:", error);
          toast({
            title: "Error",
            description: "Failed to load ride history",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRides();
  }, [user, toast]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get current rides
  const indexOfLastRide = currentPage * ridesPerPage;
  const indexOfFirstRide = indexOfLastRide - ridesPerPage;
  const currentRides = rides.slice(indexOfFirstRide, indexOfLastRide);
  const totalPages = Math.ceil(rides.length / ridesPerPage);

  return (
    <DashboardLayout>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Your Ride History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : rides.length > 0 ? (
            <>
              <div className="space-y-4">
                {currentRides.map((ride) => (
                  <div key={ride.id} className="border rounded-lg p-5 hover:bg-gray-50 dark:hover:bg-gray-800/10 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-start">
                        <div className="p-2 bg-gocabs-primary/10 rounded-full mr-3">
                          <Car className="h-5 w-5 text-gocabs-primary" />
                        </div>
                        <div>
                          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-1">
                            {ride.startLocation.address.split(',')[0]} to {ride.endLocation.address.split(',')[0]}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Clock className="h-3 w-3 mr-1 inline" /> {formatDate(ride.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center mt-3 md:mt-0 gap-3">
                        <Badge className={`${statusColor[ride.status as keyof typeof statusColor]} capitalize`}>
                          {ride.status}
                        </Badge>
                        <span className="text-md font-bold text-gray-800 dark:text-white">${ride.fare.toFixed(2)}</span>
                        
                        {ride.status === 'completed' && !ride.isRated && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs flex items-center gap-1"
                            onClick={() => {
                              // Rating logic would go here
                              toast({
                                title: "Rate your ride",
                                description: "Thank you for rating your ride!",
                              });
                            }}
                          >
                            <Star className="h-3 w-3" /> Rate
                          </Button>
                        )}
                        
                        <Link to={`/ride/${ride.id}`}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-gocabs-primary mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Pickup</p>
                          <p className="text-gray-600 dark:text-gray-400">{ride.startLocation.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Dropoff</p>
                          <p className="text-gray-600 dark:text-gray-400">{ride.endLocation.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="p-3 bg-gocabs-primary/10 rounded-full inline-flex mb-3">
                <Car className="h-6 w-6 text-gocabs-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No rides yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't taken any rides with GoCabs yet</p>
              <Link to="/dashboard">
                <Button>Book Your First Ride</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default RideHistory;
