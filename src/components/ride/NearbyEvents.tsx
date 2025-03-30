
import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Event {
  id: string;
  name: string;
  location: string;
  startTime: Date;
  endTime: Date;
  expectedCrowd: 'low' | 'medium' | 'high';
  category: 'sports' | 'concert' | 'festival' | 'conference' | 'other';
}

interface NearbyEventsProps {
  location: string;
  onSelectReturnTime: (time: Date) => void;
}

const NearbyEvents = ({ location, onSelectReturnTime }: NearbyEventsProps) => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock function to generate events near a location
  const generateMockEvents = (location: string): Event[] => {
    const now = new Date();
    const events: Event[] = [];
    
    const categories: Array<'sports' | 'concert' | 'festival' | 'conference' | 'other'> = 
      ['sports', 'concert', 'festival', 'conference', 'other'];
    
    const crowdLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    
    const eventNames = [
      'Summer Music Festival',
      'Tech Conference 2023',
      'Local Food Fair',
      'Basketball Championship',
      'Art Exhibition',
      'Community Meetup',
      'Film Screening',
      'Comedy Night'
    ];
    
    // Generate 2-4 random events
    const numEvents = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numEvents; i++) {
      // Random start time in the next 12 hours
      const startTime = new Date(now.getTime() + (1 + Math.floor(Math.random() * 12)) * 60 * 60 * 1000);
      
      // Random end time 2-5 hours after start
      const endTime = new Date(startTime.getTime() + (2 + Math.floor(Math.random() * 4)) * 60 * 60 * 1000);
      
      events.push({
        id: `evt-${i}`,
        name: eventNames[Math.floor(Math.random() * eventNames.length)],
        location: `Near ${location}`,
        startTime,
        endTime,
        expectedCrowd: crowdLevels[Math.floor(Math.random() * crowdLevels.length)],
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    }
    
    return events;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        try {
          // In a real app, this would call an events API
          const mockEvents = generateMockEvents(location);
          setEvents(mockEvents);
        } catch (error) {
          console.error("Error fetching events:", error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    };
    
    if (location) {
      fetchEvents();
    }
  }, [location]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getCrowdBadge = (crowd: 'low' | 'medium' | 'high') => {
    switch (crowd) {
      case 'low':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200">Low Traffic</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-200">Moderate Traffic</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-200">High Traffic</Badge>;
      default:
        return null;
    }
  };

  const handleSelectReturnTime = (event: Event) => {
    // Suggest return time just before the event ends (15 mins before)
    const suggestedTime = new Date(event.endTime.getTime() - 15 * 60 * 1000);
    onSelectReturnTime(suggestedTime);
    
    toast({
      title: "Return Time Selected",
      description: `Scheduled for ${formatTime(suggestedTime)}`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg font-medium">
          <Calendar className="h-5 w-5 mr-2 text-gocabs-primary" />
          Nearby Events
        </CardTitle>
        <CardDescription>
          Plan your return based on local events
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">
            <p>Finding events near your destination...</p>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{event.name}</h4>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {formatDate(event.startTime)} • {formatTime(event.startTime)} - {formatTime(event.endTime)}
                      </span>
                    </div>
                  </div>
                  <div>{getCrowdBadge(event.expectedCrowd)}</div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    <span>
                      {event.expectedCrowd === 'high' 
                        ? 'Expect surge pricing at event end' 
                        : 'Normal pricing expected'}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-7"
                    onClick={() => handleSelectReturnTime(event)}
                  >
                    Schedule Return
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming events found near your destination</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NearbyEvents;
