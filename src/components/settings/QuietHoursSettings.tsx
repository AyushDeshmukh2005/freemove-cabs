
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { QuietHours, notificationService } from '@/services/notificationService';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const QuietHoursSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: false,
    startTime: "22:00",
    endTime: "07:00",
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const settings = await notificationService.getSettings(user.id);
        setQuietHours(settings.quietHours);
      } catch (error) {
        console.error("Error loading notification settings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user?.id]);

  const handleDayToggle = (day: string) => {
    setQuietHours(prev => {
      const dayExists = prev.days.includes(day as any);
      
      if (dayExists) {
        return {
          ...prev,
          days: prev.days.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          days: [...prev.days, day] as any
        };
      }
    });
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;
    
    setIsSaving(true);
    try {
      await notificationService.updateSettings(user.id, {
        quietHours
      });
      
      toast({
        title: "Settings Saved",
        description: "Your quiet hours preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg font-medium">
          <BellOff className="h-5 w-5 mr-2 text-gocabs-primary" />
          Quiet Hours
        </CardTitle>
        <CardDescription>
          Set times when you don't want to receive non-critical notifications
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">
            <p>Loading your notification settings...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quiet-hours-toggle">Enable Quiet Hours</Label>
                <p className="text-xs text-gray-500">
                  Only critical notifications will be sent during quiet hours
                </p>
              </div>
              <Switch
                id="quiet-hours-toggle"
                checked={quietHours.enabled}
                onCheckedChange={(checked) => setQuietHours(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
            
            {quietHours.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time" className="flex items-center">
                      <Moon className="h-4 w-4 mr-2 text-indigo-500" />
                      Start Time
                    </Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={quietHours.startTime}
                      onChange={(e) => setQuietHours(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-time" className="flex items-center">
                      <Sun className="h-4 w-4 mr-2 text-amber-500" />
                      End Time
                    </Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={quietHours.endTime}
                      onChange={(e) => setQuietHours(prev => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="block mb-2">Days of Week</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.value} className="flex items-start space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={quietHours.days.includes(day.value as any)}
                          onCheckedChange={() => handleDayToggle(day.value)}
                        />
                        <Label
                          htmlFor={`day-${day.value}`}
                          className="text-sm font-normal"
                        >
                          {day.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full"
          onClick={handleSaveSettings}
          disabled={isLoading || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuietHoursSettings;
