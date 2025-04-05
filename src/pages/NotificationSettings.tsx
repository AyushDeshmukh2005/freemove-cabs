
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Bell, Mail, Phone, Clock } from 'lucide-react';

const NotificationSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    rideUpdates: true,
    promotions: true,
    driverUpdates: true,
    accountAlerts: true,
    quietHours: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "There was a problem saving your notification settings.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Notification Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage how you receive notifications and updates
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Channels
            </CardTitle>
            <CardDescription>Choose how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <Label htmlFor="email-toggle">Email notifications</Label>
              </div>
              <Switch
                id="email-toggle"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle('emailNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-gray-500" />
                <Label htmlFor="push-toggle">Push notifications</Label>
              </div>
              <Switch
                id="push-toggle"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle('pushNotifications')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <Label htmlFor="sms-toggle">SMS notifications</Label>
              </div>
              <Switch
                id="sms-toggle"
                checked={settings.smsNotifications}
                onCheckedChange={() => handleToggle('smsNotifications')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>Select which types of notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="ride-updates-toggle">Ride status updates</Label>
              <Switch
                id="ride-updates-toggle"
                checked={settings.rideUpdates}
                onCheckedChange={() => handleToggle('rideUpdates')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="driver-updates-toggle">Driver information</Label>
              <Switch
                id="driver-updates-toggle"
                checked={settings.driverUpdates}
                onCheckedChange={() => handleToggle('driverUpdates')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="promotions-toggle">Promotions and discounts</Label>
              <Switch
                id="promotions-toggle"
                checked={settings.promotions}
                onCheckedChange={() => handleToggle('promotions')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="account-alerts-toggle">Account alerts</Label>
              <Switch
                id="account-alerts-toggle"
                checked={settings.accountAlerts}
                onCheckedChange={() => handleToggle('accountAlerts')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Quiet Hours
            </CardTitle>
            <CardDescription>Pause non-critical notifications during specific hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours-toggle">Enable quiet hours</Label>
              <Switch
                id="quiet-hours-toggle"
                checked={settings.quietHours}
                onCheckedChange={() => handleToggle('quietHours')}
              />
            </div>
            
            {settings.quietHours && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start time</Label>
                  <input
                    id="quiet-start"
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End time</Label>
                  <input
                    id="quiet-end"
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
