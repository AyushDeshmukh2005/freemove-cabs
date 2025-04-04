
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bell, BellOff, BellRing, Volume2, Volume, MessageSquare, CreditCard, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { NotificationSettings as NotificationSettingsType, notificationService } from '@/services/notificationService';
import QuietHoursSettings from '@/components/settings/QuietHoursSettings';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) return;
      
      setIsLoading(true);
      try {
        const userSettings = await notificationService.getSettings(user.id);
        setSettings(userSettings);
      } catch (error) {
        console.error("Error loading notification settings:", error);
        toast({
          title: "Error",
          description: "Failed to load notification settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user?.id, toast]);

  const handleToggleSetting = (setting: keyof NotificationSettingsType) => {
    if (!settings) return;
    
    setSettings({
      ...settings,
      [setting]: !settings[setting as keyof NotificationSettingsType]
    });
  };

  const handleSaveSettings = async () => {
    if (!user?.id || !settings) return;
    
    setIsSaving(true);
    try {
      await notificationService.updateSettings(user.id, settings);
      
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Notification Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Control how and when you receive notifications
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuietHoursSettings />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg font-medium">
                <Bell className="h-5 w-5 mr-2 text-gocabs-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose which notifications you want to receive
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="py-4 text-center text-gray-500">
                  <p>Loading your notification settings...</p>
                </div>
              ) : settings ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <BellRing className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <Label htmlFor="ride-updates">Ride Updates</Label>
                          <p className="text-xs text-gray-500">
                            Driver arrival, ride progress, and completion
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="ride-updates"
                        checked={settings.rideUpdates}
                        onCheckedChange={() => handleToggleSetting('rideUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <Volume2 className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <Label htmlFor="driver-arrival">Driver Arrival</Label>
                          <p className="text-xs text-gray-500">
                            Alerts when your driver arrives at pickup
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="driver-arrival"
                        checked={settings.driverArrival}
                        onCheckedChange={() => handleToggleSetting('driverArrival')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <Label htmlFor="promotions">Promotions</Label>
                          <p className="text-xs text-gray-500">
                            Discounts, offers, and promotional campaigns
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="promotions"
                        checked={settings.promotions}
                        onCheckedChange={() => handleToggleSetting('promotions')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <CreditCard className="h-5 w-5 text-purple-500 mt-0.5" />
                        <div>
                          <Label htmlFor="payment-receipts">Payment Receipts</Label>
                          <p className="text-xs text-gray-500">
                            Notifications for completed payments
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="payment-receipts"
                        checked={settings.paymentReceipts}
                        onCheckedChange={() => handleToggleSetting('paymentReceipts')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-start space-x-3">
                        <Zap className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div>
                          <Label htmlFor="new-features">New Features</Label>
                          <p className="text-xs text-gray-500">
                            Updates about new app features and improvements
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="new-features"
                        checked={settings.newFeatures}
                        onCheckedChange={() => handleToggleSetting('newFeatures')}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Button
                    className="w-full"
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Failed to load notification settings</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
