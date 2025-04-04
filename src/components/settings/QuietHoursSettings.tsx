
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { QuietHours, getQuietHours, updateQuietHours } from "@/services/notificationService";
import { useAuth } from "@/context/AuthContext";

const DAYS_OF_WEEK = [
  { id: 'mon', label: 'Monday' },
  { id: 'tue', label: 'Tuesday' },
  { id: 'wed', label: 'Wednesday' },
  { id: 'thu', label: 'Thursday' },
  { id: 'fri', label: 'Friday' },
  { id: 'sat', label: 'Saturday' },
  { id: 'sun', label: 'Sunday' },
];

const QuietHoursSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [quietHours, setQuietHours] = useState<QuietHours>({
    userId: user?.id || '',
    enabled: false,
    startTime: '22:00',
    endTime: '07:00',
    daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
  });

  useEffect(() => {
    const loadQuietHours = async () => {
      if (!user) return;
      
      try {
        const data = await getQuietHours(user.id);
        if (data) {
          setQuietHours(data);
        }
      } catch (error) {
        console.error('Error loading quiet hours:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadQuietHours();
  }, [user]);

  const handleToggleEnabled = (checked: boolean) => {
    setQuietHours(prev => ({ ...prev, enabled: checked }));
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setQuietHours(prev => ({ ...prev, [field]: value }));
  };

  const handleDayToggle = (day: string) => {
    setQuietHours(prev => {
      const currentDays = [...prev.daysOfWeek];
      
      if (currentDays.includes(day)) {
        return { ...prev, daysOfWeek: currentDays.filter(d => d !== day) };
      } else {
        return { ...prev, daysOfWeek: [...currentDays, day] };
      }
    });
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      await updateQuietHours(user.id, quietHours);
      
      toast({
        title: "Settings saved",
        description: "Your quiet hours preferences have been updated.",
      });
    } catch (error) {
      console.error('Error saving quiet hours:', error);
      
      toast({
        title: "Save failed",
        description: "There was a problem saving your settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiet Hours</CardTitle>
        <CardDescription>
          During quiet hours, you'll only receive important notifications such as ride updates and safety alerts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="quiet-hours-toggle" className="font-medium">Enable Quiet Hours</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pause non-essential notifications during set hours
            </p>
          </div>
          <Switch
            id="quiet-hours-toggle"
            checked={quietHours.enabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>
        
        {quietHours.enabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={quietHours.startTime}
                  onChange={(e) => handleTimeChange('startTime', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={quietHours.endTime}
                  onChange={(e) => handleTimeChange('endTime', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label className="block mb-3">Active Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day.id}`}
                      checked={quietHours.daysOfWeek.includes(day.id)}
                      onCheckedChange={() => handleDayToggle(day.id)}
                    />
                    <Label htmlFor={`day-${day.id}`} className="font-normal">
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        <Button onClick={handleSave} disabled={isLoading}>
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuietHoursSettings;
