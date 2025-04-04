
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Clock, Bell, Mail, Smartphone, 
  AlertCircle, Car, Calendar, Zap, 
  CreditCard, Timer, DollarSign, Gift, 
  Shield, MessageCircle, Info 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '../components/ui/card';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  category: 'ride' | 'payment' | 'promo' | 'account';
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  icon: React.ReactNode;
  criticalSafety?: boolean;
}

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quietHours, setQuietHours] = useState({
    enabled: false,
    from: '22:00',
    to: '07:00',
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'driver_assigned',
      title: 'Driver assigned',
      description: 'When a driver accepts your ride request',
      category: 'ride',
      channels: { push: true, email: false, sms: false },
      icon: <Car className="h-5 w-5" />,
    },
    {
      id: 'driver_nearby',
      title: 'Driver arriving',
      description: 'When your driver is approaching pickup location',
      category: 'ride',
      channels: { push: true, email: false, sms: true },
      icon: <Zap className="h-5 w-5" />,
    },
    {
      id: 'ride_cancelled',
      title: 'Ride cancelled',
      description: 'When your ride is cancelled by driver or system',
      category: 'ride',
      channels: { push: true, email: true, sms: true },
      icon: <AlertCircle className="h-5 w-5" />,
      criticalSafety: true,
    },
    {
      id: 'ride_completed',
      title: 'Ride completed',
      description: 'After reaching your destination',
      category: 'ride',
      channels: { push: true, email: false, sms: false },
      icon: <Car className="h-5 w-5" />,
    },
    {
      id: 'payment_success',
      title: 'Payment successful',
      description: 'When a payment is processed successfully',
      category: 'payment',
      channels: { push: true, email: true, sms: false },
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: 'payment_failed',
      title: 'Payment failed',
      description: 'When a payment attempt fails',
      category: 'payment',
      channels: { push: true, email: true, sms: true },
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      id: 'fare_estimate',
      title: 'Fare estimate',
      description: 'Receive fare estimates before confirming ride',
      category: 'payment',
      channels: { push: true, email: false, sms: false },
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      id: 'promo_new',
      title: 'New promotions',
      description: 'When new offers or discounts are available',
      category: 'promo',
      channels: { push: true, email: true, sms: false },
      icon: <Gift className="h-5 w-5" />,
    },
    {
      id: 'promo_expiring',
      title: 'Expiring promotions',
      description: 'When your saved promotions are about to expire',
      category: 'promo',
      channels: { push: true, email: false, sms: false },
      icon: <Timer className="h-5 w-5" />,
    },
    {
      id: 'account_security',
      title: 'Security alerts',
      description: 'Login attempts and security notifications',
      category: 'account',
      channels: { push: true, email: true, sms: true },
      icon: <Shield className="h-5 w-5" />,
      criticalSafety: true,
    },
    {
      id: 'account_support',
      title: 'Support messages',
      description: 'Replies to your support requests',
      category: 'account',
      channels: { push: true, email: true, sms: false },
      icon: <MessageCircle className="h-5 w-5" />,
    },
  ]);
  
  const handleToggleChannel = (settingId: string, channel: 'push' | 'email' | 'sms') => {
    setNotificationSettings(settings => 
      settings.map(setting => {
        if (setting.id === settingId) {
          // Don't allow turning off critical safety notifications
          if (setting.criticalSafety && channel === 'push') {
            toast({
              title: "Safety Critical",
              description: "This notification cannot be disabled for your safety.",
              variant: "destructive",
            });
            return setting;
          }
          
          const updatedChannels = {
            ...setting.channels,
            [channel]: !setting.channels[channel]
          };
          
          return { ...setting, channels: updatedChannels };
        }
        return setting;
      })
    );
    
    toast({
      title: "Notification Setting Updated",
      description: "Your notification preferences have been updated.",
    });
  };
  
  const handleToggleQuietHours = (enabled: boolean) => {
    setQuietHours({ ...quietHours, enabled });
    
    toast({
      title: enabled ? "Quiet Hours Enabled" : "Quiet Hours Disabled",
      description: enabled 
        ? `No notifications between ${quietHours.from} and ${quietHours.to}` 
        : "You will receive notifications at all hours",
    });
  };
  
  const updateQuietHours = (key: 'from' | 'to', value: string) => {
    setQuietHours({ ...quietHours, [key]: value });
    
    toast({
      title: "Quiet Hours Updated",
      description: `Quiet hours ${key} time updated to ${value}`,
    });
  };
  
  const toggleAllNotifications = (category: string, channel: 'push' | 'email' | 'sms', enable: boolean) => {
    setNotificationSettings(settings => 
      settings.map(setting => {
        if (setting.category === category) {
          // Don't modify critical safety notifications if trying to disable
          if (setting.criticalSafety && channel === 'push' && !enable) {
            return setting;
          }
          
          const updatedChannels = {
            ...setting.channels,
            [channel]: enable
          };
          
          return { ...setting, channels: updatedChannels };
        }
        return setting;
      })
    );
    
    toast({
      title: "Notification Settings Updated",
      description: `All ${category} ${channel} notifications have been ${enable ? 'enabled' : 'disabled'}.`,
    });
  };
  
  // Filter settings by category
  const rideSettings = notificationSettings.filter(s => s.category === 'ride');
  const paymentSettings = notificationSettings.filter(s => s.category === 'payment');
  const promoSettings = notificationSettings.filter(s => s.category === 'promo');
  const accountSettings = notificationSettings.filter(s => s.category === 'account');
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Bell className="h-8 w-8 text-gocabs-primary mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notification Settings</h1>
              <p className="text-muted-foreground">
                Manage how and when you receive notifications from GoCabs.
              </p>
            </div>
          </div>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Quiet Hours
              </CardTitle>
              <CardDescription>
                Set times when you don't want to be disturbed by notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Quiet Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Only critical notifications will be sent during these hours.
                  </p>
                </div>
                <Switch 
                  checked={quietHours.enabled} 
                  onCheckedChange={handleToggleQuietHours} 
                  aria-label="Toggle quiet hours"
                />
              </div>
              
              {quietHours.enabled && (
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">From</p>
                    <input 
                      type="time" 
                      value={quietHours.from} 
                      onChange={(e) => updateQuietHours('from', e.target.value)} 
                      className="border rounded p-2 bg-transparent"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">To</p>
                    <input 
                      type="time" 
                      value={quietHours.to} 
                      onChange={(e) => updateQuietHours('to', e.target.value)} 
                      className="border rounded p-2 bg-transparent"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="bg-muted/40 rounded-lg p-4 mb-6">
            <div className="flex space-x-2 mb-3">
              <h2 className="text-lg font-semibold">Notification Channels</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white dark:bg-gocabs-secondary/30 rounded-lg p-3 flex items-center space-x-3 flex-1">
                <div className="h-10 w-10 bg-gocabs-primary/10 rounded-full flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-gocabs-primary" />
                </div>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Delivered to your device</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gocabs-secondary/30 rounded-lg p-3 flex items-center space-x-3 flex-1">
                <div className="h-10 w-10 bg-gocabs-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gocabs-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Sent to your email address</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gocabs-secondary/30 rounded-lg p-3 flex items-center space-x-3 flex-1">
                <div className="h-10 w-10 bg-gocabs-primary/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-gocabs-primary" />
                </div>
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-xs text-muted-foreground">Sent as text messages</p>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="ride" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Notification Preferences</h2>
              <TabsList>
                <TabsTrigger value="ride">Ride</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="promo">Promotions</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="ride">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Ride Notifications</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('ride', 'push', true)}
                      >
                        Enable All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('ride', 'push', false)}
                      >
                        Disable All
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Notifications related to your ride experiences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rideSettings.map(setting => (
                      <div 
                        key={setting.id} 
                        className="p-3 border rounded-lg bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-gocabs-primary/10 p-1.5 rounded-md text-gocabs-primary">
                            {setting.icon}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{setting.title}</p>
                              {setting.criticalSafety && (
                                <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                                  Safety Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-3 sm:space-x-5">
                          <div className="flex flex-col items-center space-y-1">
                            <Smartphone className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.push}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'push')}
                              aria-label={`Toggle push notification for ${setting.title}`}
                              disabled={setting.criticalSafety}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <Mail className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.email}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'email')}
                              aria-label={`Toggle email notification for ${setting.title}`}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <MessageCircle className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.sms}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'sms')}
                              aria-label={`Toggle SMS notification for ${setting.title}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Payment Notifications</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('payment', 'push', true)}
                      >
                        Enable All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('payment', 'push', false)}
                      >
                        Disable All
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Notifications related to payments and transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentSettings.map(setting => (
                      <div 
                        key={setting.id} 
                        className="p-3 border rounded-lg bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-gocabs-primary/10 p-1.5 rounded-md text-gocabs-primary">
                            {setting.icon}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{setting.title}</p>
                              {setting.criticalSafety && (
                                <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                                  Safety Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-3 sm:space-x-5">
                          <div className="flex flex-col items-center space-y-1">
                            <Smartphone className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.push}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'push')}
                              aria-label={`Toggle push notification for ${setting.title}`}
                              disabled={setting.criticalSafety}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <Mail className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.email}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'email')}
                              aria-label={`Toggle email notification for ${setting.title}`}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <MessageCircle className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.sms}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'sms')}
                              aria-label={`Toggle SMS notification for ${setting.title}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="promo">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Promotional Notifications</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('promo', 'push', true)}
                      >
                        Enable All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('promo', 'push', false)}
                      >
                        Disable All
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Notifications related to offers and promotions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {promoSettings.map(setting => (
                      <div 
                        key={setting.id} 
                        className="p-3 border rounded-lg bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-gocabs-primary/10 p-1.5 rounded-md text-gocabs-primary">
                            {setting.icon}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{setting.title}</p>
                              {setting.criticalSafety && (
                                <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                                  Safety Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-3 sm:space-x-5">
                          <div className="flex flex-col items-center space-y-1">
                            <Smartphone className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.push}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'push')}
                              aria-label={`Toggle push notification for ${setting.title}`}
                              disabled={setting.criticalSafety}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <Mail className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.email}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'email')}
                              aria-label={`Toggle email notification for ${setting.title}`}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <MessageCircle className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.sms}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'sms')}
                              aria-label={`Toggle SMS notification for ${setting.title}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Account Notifications</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('account', 'push', true)}
                      >
                        Enable All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => toggleAllNotifications('account', 'push', false)}
                      >
                        Disable All
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Notifications related to your account and security.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accountSettings.map(setting => (
                      <div 
                        key={setting.id} 
                        className="p-3 border rounded-lg bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="bg-gocabs-primary/10 p-1.5 rounded-md text-gocabs-primary">
                            {setting.icon}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{setting.title}</p>
                              {setting.criticalSafety && (
                                <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                                  Safety Critical
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>
                        <div className="flex space-x-3 sm:space-x-5">
                          <div className="flex flex-col items-center space-y-1">
                            <Smartphone className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.push}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'push')}
                              aria-label={`Toggle push notification for ${setting.title}`}
                              disabled={setting.criticalSafety}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <Mail className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.email}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'email')}
                              aria-label={`Toggle email notification for ${setting.title}`}
                            />
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <MessageCircle className="h-4 w-4" />
                            <Switch 
                              size="sm"
                              checked={setting.channels.sms}
                              onCheckedChange={() => handleToggleChannel(setting.id, 'sms')}
                              aria-label={`Toggle SMS notification for ${setting.title}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 flex items-start space-x-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <Info className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">About Safety Critical Notifications</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Safety critical notifications cannot be disabled and will be sent through all available channels. These include ride cancellations, safety alerts, and account security notifications.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
