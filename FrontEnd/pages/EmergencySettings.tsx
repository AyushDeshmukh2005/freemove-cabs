
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Switch } from '../components/ui/switch';
import { AlertCircle, ShieldAlert, Phone, Users, MessageCircle, MapPin, Info } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

const EmergencySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Jane Smith',
      phone: '+1 555-123-4567',
      relationship: 'Spouse'
    }
  ]);
  
  const [shareLocationAlways, setShareLocationAlways] = useState(false);
  const [sendRideUpdates, setSendRideUpdates] = useState(true);
  const [quickSosEnabled, setQuickSosEnabled] = useState(true);
  const [showEmergencyServicesPopup, setShowEmergencyServicesPopup] = useState(true);
  
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  
  const [isAddingContact, setIsAddingContact] = useState(false);
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and phone number.",
        variant: "destructive",
      });
      return;
    }
    
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact
    };
    
    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({ name: '', phone: '', relationship: '' });
    setIsAddingContact(false);
    
    toast({
      title: "Contact Added",
      description: `${newContact.name} has been added as an emergency contact.`,
    });
  };
  
  const handleRemoveContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    
    toast({
      title: "Contact Removed",
      description: "The emergency contact has been removed.",
    });
  };
  
  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case 'location':
        setShareLocationAlways(value);
        toast({
          title: value ? "Location Sharing Enabled" : "Location Sharing Disabled",
          description: value 
            ? "Your location will be shared with emergency contacts during rides." 
            : "Your location will only be shared when activated.",
        });
        break;
      case 'updates':
        setSendRideUpdates(value);
        toast({
          title: value ? "Ride Updates Enabled" : "Ride Updates Disabled",
          description: value 
            ? "Your emergency contacts will receive ride updates." 
            : "Your emergency contacts will not receive automatic ride updates.",
        });
        break;
      case 'sos':
        setQuickSosEnabled(value);
        toast({
          title: value ? "Quick SOS Enabled" : "Quick SOS Disabled",
          description: value 
            ? "Triple-tap power button to activate emergency mode." 
            : "Quick SOS feature has been disabled.",
        });
        break;
      case 'popup':
        setShowEmergencyServicesPopup(value);
        toast({
          title: value ? "Emergency Popup Enabled" : "Emergency Popup Disabled",
          description: value 
            ? "Emergency services popup will be shown during emergencies." 
            : "Emergency services popup has been disabled.",
        });
        break;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6">
            <ShieldAlert className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Emergency Settings</h1>
              <p className="text-muted-foreground">
                Configure your safety preferences and emergency contacts.
              </p>
            </div>
          </div>
          
          <Card className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-red-700 dark:text-red-400">
                Emergency Contacts
              </CardTitle>
              <CardDescription className="text-red-600/80 dark:text-red-400/80">
                These people will be contacted in case of an emergency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {emergencyContacts.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-red-200 dark:border-red-800 rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-red-400 mb-3" />
                  <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                    You haven't added any emergency contacts yet.
                  </p>
                  <Button 
                    onClick={() => setIsAddingContact(true)}
                    variant="outline" 
                    className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    Add Your First Contact
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {emergencyContacts.map(contact => (
                    <div 
                      key={contact.id} 
                      className="flex items-center justify-between p-3 bg-white dark:bg-gocabs-secondary/30 rounded-lg border border-red-100 dark:border-red-900"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{contact.name}</p>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Phone className="h-3 w-3 mr-1" />
                            {contact.phone}
                            {contact.relationship && (
                              <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 px-2 py-0.5 rounded-full">
                                {contact.relationship}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveContact(contact.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  
                  {!isAddingContact && (
                    <Button
                      variant="outline" 
                      className="w-full mt-2 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                      onClick={() => setIsAddingContact(true)}
                    >
                      + Add Contact
                    </Button>
                  )}
                </div>
              )}
              
              {isAddingContact && (
                <div className="mt-4 p-4 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="text-base font-medium text-red-700 dark:text-red-400 mb-3">
                    Add Emergency Contact
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-red-600 dark:text-red-300">
                        Name
                      </Label>
                      <Input 
                        id="name" 
                        value={newContact.name} 
                        onChange={e => setNewContact({...newContact, name: e.target.value})}
                        placeholder="Full name"
                        className="border-red-200 dark:border-red-800 focus-visible:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-red-600 dark:text-red-300">
                        Phone Number
                      </Label>
                      <Input 
                        id="phone" 
                        value={newContact.phone} 
                        onChange={e => setNewContact({...newContact, phone: e.target.value})}
                        placeholder="+XX XXX-XXX-XXXX"
                        className="border-red-200 dark:border-red-800 focus-visible:ring-red-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship" className="text-red-600 dark:text-red-300">
                        Relationship (Optional)
                      </Label>
                      <Input 
                        id="relationship" 
                        value={newContact.relationship} 
                        onChange={e => setNewContact({...newContact, relationship: e.target.value})}
                        placeholder="e.g., Family, Friend"
                        className="border-red-200 dark:border-red-800 focus-visible:ring-red-500"
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                        onClick={() => {
                          setIsAddingContact(false);
                          setNewContact({ name: '', phone: '', relationship: '' });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleAddContact}
                      >
                        Save Contact
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Safety Preferences</CardTitle>
              <CardDescription>
                Configure how the emergency features work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gocabs-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Share Location with Contacts</p>
                    <p className="text-sm text-muted-foreground">
                      Allow emergency contacts to track your location during rides.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={shareLocationAlways}
                  onCheckedChange={checked => handleSettingChange('location', checked)}
                  aria-label="Share location toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <MessageCircle className="h-5 w-5 text-gocabs-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Send Ride Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically send ride updates to emergency contacts.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={sendRideUpdates}
                  onCheckedChange={checked => handleSettingChange('updates', checked)}
                  aria-label="Ride updates toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <ShieldAlert className="h-5 w-5 text-gocabs-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Quick SOS</p>
                    <p className="text-sm text-muted-foreground">
                      Triple-tap power button to activate emergency mode.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={quickSosEnabled}
                  onCheckedChange={checked => handleSettingChange('sos', checked)}
                  aria-label="Quick SOS toggle"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-gocabs-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Emergency Services Popup</p>
                    <p className="text-sm text-muted-foreground">
                      Show emergency services popup during emergencies.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={showEmergencyServicesPopup}
                  onCheckedChange={checked => handleSettingChange('popup', checked)}
                  aria-label="Emergency popup toggle"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-800 rounded-lg p-4 flex items-start">
            <Info className="h-5 w-5 text-amber-500 mr-3 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 dark:text-amber-400 mb-1">
                How to use Emergency Features
              </p>
              <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-disc pl-4">
                <li>Triple-tap power button to activate SOS mode.</li>
                <li>In SOS mode, your location is shared with emergency contacts.</li>
                <li>Nearby authorities are notified of your situation.</li>
                <li>Red alert banner appears for nearby drivers to help.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencySettings;
