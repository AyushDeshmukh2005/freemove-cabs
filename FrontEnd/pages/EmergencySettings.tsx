
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Phone, UserPlus, MapPin, MessageSquare, Shield, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const EmergencySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('contacts');
  const [isLoading, setIsLoading] = useState(false);
  
  // Emergency contact state
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Jane Smith',
      phone: '(555) 123-4567',
      relationship: 'Spouse',
    },
    {
      id: '2',
      name: 'John Doe',
      phone: '(555) 987-6543',
      relationship: 'Family',
    }
  ]);
  
  // State for new contact form
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelationship, setNewContactRelationship] = useState('');
  
  // SOS settings state
  const [sosEnabled, setSosEnabled] = useState(true);
  const [shareLocationOnSOS, setShareLocationOnSOS] = useState(true);
  const [autoCallEmergencyServices, setAutoCallEmergencyServices] = useState(false);
  const [sosMessageText, setSosMessageText] = useState('I need help! This is an emergency alert from my rideshare app.');
  
  const handleAddContact = () => {
    if (!newContactName || !newContactPhone) {
      toast({
        title: "Missing Information",
        description: "Please enter both name and phone number.",
        variant: "destructive",
      });
      return;
    }
    
    const newContact = {
      id: Date.now().toString(),
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRelationship || 'Other',
    };
    
    setEmergencyContacts([...emergencyContacts, newContact]);
    setShowAddContact(false);
    setNewContactName('');
    setNewContactPhone('');
    setNewContactRelationship('');
    
    toast({
      title: "Contact Added",
      description: `${newContactName} has been added to your emergency contacts.`,
    });
  };
  
  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(contacts => contacts.filter(c => c.id !== id));
    
    toast({
      title: "Contact Removed",
      description: "The contact has been removed from your emergency list.",
    });
  };
  
  const handleSaveSOSSettings = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Settings Saved",
        description: "Your emergency settings have been updated.",
      });
    }, 1000);
  };
  
  const handleTestSOSButton = () => {
    toast({
      title: "SOS Test Mode",
      description: "This is a test. In a real emergency, contacts would be notified.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Emergency Settings</h1>
            <p className="text-gray-500 mt-1">Configure your safety features and emergency contacts</p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="sos">SOS Settings</TabsTrigger>
          </TabsList>
          
          <Card className="bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800">
            <CardContent className="p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-700 dark:text-red-400">Emergency Features</h3>
                  <p className="text-sm text-red-600 dark:text-red-300">
                    These settings are crucial for your safety. Keep your information up to date for emergency situations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-blue-500" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription>
                  People to notify during emergency situations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyContacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                        <div className="text-xs text-gray-400">{contact.relationship}</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveContact(contact.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  {emergencyContacts.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      No emergency contacts added
                    </div>
                  )}
                  
                  {showAddContact ? (
                    <div className="space-y-4 border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Add New Contact</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowAddContact(false)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Full Name</Label>
                          <Input
                            id="contact-name"
                            placeholder="John Doe"
                            value={newContactName}
                            onChange={(e) => setNewContactName(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone Number</Label>
                          <Input
                            id="contact-phone"
                            placeholder="(555) 123-4567"
                            value={newContactPhone}
                            onChange={(e) => setNewContactPhone(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contact-relationship">Relationship</Label>
                          <Input
                            id="contact-relationship"
                            placeholder="Family, Friend, etc."
                            value={newContactRelationship}
                            onChange={(e) => setNewContactRelationship(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleAddContact}
                        className="w-full"
                      >
                        Add Contact
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowAddContact(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Emergency Contact
                    </Button>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-xs text-gray-500">
                  Emergency contacts will be notified if you activate the SOS feature during a ride.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="sos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-500" />
                  SOS Button Settings
                </CardTitle>
                <CardDescription>
                  Configure how the emergency SOS button works
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sos-toggle">Enable SOS Button</Label>
                      <p className="text-sm text-gray-500">
                        Activates the emergency button during rides
                      </p>
                    </div>
                    <Switch 
                      id="sos-toggle"
                      checked={sosEnabled}
                      onCheckedChange={setSosEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="location-toggle">Share Location</Label>
                      <p className="text-sm text-gray-500">
                        Send your exact location to contacts during SOS
                      </p>
                    </div>
                    <Switch 
                      id="location-toggle"
                      checked={shareLocationOnSOS}
                      onCheckedChange={setShareLocationOnSOS}
                      disabled={!sosEnabled}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-call-toggle">Auto-call Emergency Services</Label>
                      <p className="text-sm text-gray-500">
                        Automatically call local emergency services (911)
                      </p>
                    </div>
                    <Switch 
                      id="auto-call-toggle"
                      checked={autoCallEmergencyServices}
                      onCheckedChange={setAutoCallEmergencyServices}
                      disabled={!sosEnabled}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sos-message">Emergency Message</Label>
                    <textarea
                      id="sos-message"
                      className="w-full min-h-[100px] p-2 border border-gray-300 dark:border-gray-700 rounded-md"
                      placeholder="Enter the message to send to your emergency contacts"
                      value={sosMessageText}
                      onChange={(e) => setSosMessageText(e.target.value)}
                      disabled={!sosEnabled}
                    ></textarea>
                    <p className="text-xs text-gray-500">
                      This message will be sent to your emergency contacts along with your location.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  onClick={handleSaveSOSSettings} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleTestSOSButton}
                  disabled={!sosEnabled}
                >
                  Test SOS Button (Safe Mode)
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Important Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm">Always share your trip details with friends or family for important rides</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm">Verify your driver's identity and car details before entering the vehicle</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm">Sit in the back seat when traveling alone for additional safety</p>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    <p className="text-sm">Trust your instincts - if something feels wrong, cancel the ride</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EmergencySettings;
