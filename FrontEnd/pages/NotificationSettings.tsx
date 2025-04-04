
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, Clock, MapPin, UserCheck, Car, CreditCard, Gift, Megaphone, Check } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [generalNotifications, setGeneralNotifications] = useState({
    rideUpdates: true,
    promotions: true,
    accountAlerts: true,
    appUpdates: false
  });
  
  const [notificationMethods, setNotificationMethods] = useState({
    pushNotifications: true,
    email: true,
    sms: false
  });
  
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    startTime: "22:00",
    endTime: "07:00"
  });
  
  const [notificationDistance, setNotificationDistance] = useState(10); // in minutes
  
  const handleGeneralSettingChange = (setting, value) => {
    setGeneralNotifications({
      ...generalNotifications,
      [setting]: value
    });
  };
  
  const handleMethodChange = (method, value) => {
    setNotificationMethods({
      ...notificationMethods,
      [method]: value
    });
  };
  
  const handleQuietHoursChange = (property, value) => {
    setQuietHours({
      ...quietHours,
      [property]: value
    });
  };
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your notification preferences have been updated",
    });
  };
  
  const notificationTypes = [
    { id: 'rideUpdates', name: "Ride Updates", icon: Car, description: "Driver arrival, ride status changes" },
    { id: 'accountAlerts', name: "Account Alerts", icon: UserCheck, description: "Security alerts, account changes" },
    { id: 'promotions', name: "Promotions & Offers", icon: Gift, description: "Discounts, special offers, rewards" },
    { id: 'appUpdates', name: "App Updates", icon: Megaphone, description: "New features and improvements" }
  ];
  
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Bell className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Notification Settings</h1>
        </div>
        
        <div className="grid gap-6">
          {/* Notification Types Section */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>Choose what types of notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationTypes.map((type) => (
                  <div key={type.id} className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <type.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor={type.id} className="font-medium">
                          {type.name}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      id={type.id}
                      checked={generalNotifications[type.id]}
                      onCheckedChange={(checked) => handleGeneralSettingChange(type.id, checked)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Delivery Methods Section */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Methods</CardTitle>
              <CardDescription>How would you like to receive your notifications?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Push Notifications
                  </Label>
                  <Switch
                    id="push"
                    checked={notificationMethods.pushNotifications}
                    onCheckedChange={(checked) => handleMethodChange('pushNotifications', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Email
                  </Label>
                  <Switch
                    id="email"
                    checked={notificationMethods.email}
                    onCheckedChange={(checked) => handleMethodChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms" className="flex items-center gap-2">
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    SMS
                  </Label>
                  <Switch
                    id="sms"
                    checked={notificationMethods.sms}
                    onCheckedChange={(checked) => handleMethodChange('sms', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quiet Hours Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Quiet Hours
                  </CardTitle>
                  <CardDescription>
                    No notifications will be sent during these hours
                  </CardDescription>
                </div>
                <Switch
                  checked={quietHours.enabled}
                  onCheckedChange={(checked) => handleQuietHoursChange('enabled', checked)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time" className="block mb-2">Start Time</Label>
                  <Select
                    disabled={!quietHours.enabled}
                    value={quietHours.startTime}
                    onValueChange={(value) => handleQuietHoursChange('startTime', value)}
                  >
                    <SelectTrigger id="start-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(Array(24).keys()).map(hour => (
                        <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                          {hour.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="end-time" className="block mb-2">End Time</Label>
                  <Select
                    disabled={!quietHours.enabled}
                    value={quietHours.endTime}
                    onValueChange={(value) => handleQuietHoursChange('endTime', value)}
                  >
                    <SelectTrigger id="end-time">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(Array(24).keys()).map(hour => (
                        <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                          {hour.toString().padStart(2, '0')}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Advanced Settings Section */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="driver-proximity" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Driver Arrival Notification
                    </Label>
                    <span className="text-sm font-medium">{notificationDistance} minutes before</span>
                  </div>
                  <Slider
                    id="driver-proximity"
                    min={1}
                    max={20}
                    step={1}
                    value={[notificationDistance]}
                    onValueChange={([value]) => setNotificationDistance(value)}
                    className="py-4"
                  />
                  <p className="text-sm text-gray-500">
                    Get notified when your driver is about to arrive
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing Preferences</h3>
                    <p className="text-sm text-gray-500">
                      Receive updates about our products and services
                    </p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-end">
              <Button onClick={handleSaveSettings} className="flex items-center">
                <Check className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
