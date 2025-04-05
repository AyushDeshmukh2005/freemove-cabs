
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Bell, Clock, Car, Map, CreditCard, MessageSquare, Settings, Save, Shield, Timer } from 'lucide-react';

interface NotificationSetting {
  id: string;
  type: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const NotificationSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      type: 'Ride Updates',
      description: 'Driver arrival, ride start and completion',
      email: true,
      push: true,
      sms: false,
    },
    {
      id: '2',
      type: 'Payment',
      description: 'Receipts and payment confirmations',
      email: true,
      push: true,
      sms: true,
    },
    {
      id: '3',
      type: 'Promotions',
      description: 'Discounts and special offers',
      email: true,
      push: false,
      sms: false,
    },
    {
      id: '4',
      type: 'Account',
      description: 'Security alerts and account changes',
      email: true,
      push: true,
      sms: true,
    },
  ]);
  
  const toggleNotificationChannel = (id: string, channel: 'email' | 'push' | 'sms', value: boolean) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, [channel]: value } 
          : setting
      )
    );
  };
  
  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Notification Settings</h1>
            <p className="text-gray-500 mt-1">Manage how you receive notifications</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-gocabs-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which notifications you'd like to receive and how
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-center pb-2">
                  <div className="col-span-1"></div>
                  <div>Email</div>
                  <div>Push</div>
                  <div>SMS</div>
                </div>
                
                <Separator />
                
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="grid grid-cols-4 items-center gap-4 py-3">
                    <div className="col-span-1">
                      <div className="font-medium">{setting.type}</div>
                      <div className="text-sm text-gray-500">{setting.description}</div>
                    </div>
                    <div className="flex justify-center">
                      <Switch 
                        checked={setting.email}
                        onCheckedChange={(checked) => toggleNotificationChannel(setting.id, 'email', checked)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch 
                        checked={setting.push}
                        onCheckedChange={(checked) => toggleNotificationChannel(setting.id, 'push', checked)}
                      />
                    </div>
                    <div className="flex justify-center">
                      <Switch 
                        checked={setting.sms}
                        onCheckedChange={(checked) => toggleNotificationChannel(setting.id, 'sms', checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gocabs-primary" />
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set times when you don't want to be disturbed with notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quiet-hours" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-gray-500" />
                    Enable Quiet Hours
                  </Label>
                  <Switch 
                    id="quiet-hours"
                    checked={quietHoursEnabled}
                    onCheckedChange={setQuietHoursEnabled}
                  />
                </div>
                
                {quietHoursEnabled && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <Timer className="h-4 w-4 mx-3 text-gray-500" />
                        <input 
                          id="start-time"
                          type="time" 
                          value={quietHoursStart}
                          onChange={(e) => setQuietHoursStart(e.target.value)}
                          className="flex-1 py-2 px-1 border-0 focus:ring-0 bg-transparent"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <div className="flex items-center border rounded-md overflow-hidden">
                        <Timer className="h-4 w-4 mx-3 text-gray-500" />
                        <input 
                          id="end-time"
                          type="time" 
                          value={quietHoursEnd}
                          onChange={(e) => setQuietHoursEnd(e.target.value)}
                          className="flex-1 py-2 px-1 border-0 focus:ring-0 bg-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveSettings} 
                disabled={isLoading}
                className="ml-auto"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
