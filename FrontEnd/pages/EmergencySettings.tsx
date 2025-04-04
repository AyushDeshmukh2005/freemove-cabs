
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  PhoneCall, 
  AlertTriangle, 
  MapPin, 
  UserPlus,
  Save
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const EmergencySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: "John Doe", phone: "+1 (555) 123-4567", relationship: "Family" },
    { id: 2, name: "Jane Smith", phone: "+1 (555) 987-6543", relationship: "Friend" }
  ]);

  const [settings, setSettings] = useState({
    shareLocationInEmergency: true,
    silentEmergencyAlert: false,
    automaticEmergencyDetection: true,
    policeAutoAlert: false
  });
  
  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    relationship: ""
  });
  
  const handleRemoveContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Removed",
      description: "Emergency contact has been removed",
    });
  };
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide name and phone number",
        variant: "destructive",
      });
      return;
    }
    
    const id = Math.max(0, ...emergencyContacts.map(c => c.id)) + 1;
    setEmergencyContacts([
      ...emergencyContacts,
      { 
        id, 
        name: newContact.name, 
        phone: newContact.phone, 
        relationship: newContact.relationship 
      }
    ]);
    
    setNewContact({ name: "", phone: "", relationship: "" });
    
    toast({
      title: "Contact Added",
      description: "New emergency contact has been added",
    });
  };
  
  const handleSettingChange = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings Saved",
      description: "Your emergency settings have been updated",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Shield className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Emergency Settings</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Emergency Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PhoneCall className="mr-2 h-5 w-5" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>
                These people will be notified in case of an emergency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyContacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                      <p className="text-xs text-gray-400">{contact.relationship}</p>
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
                  <div className="text-center py-4 text-gray-500">
                    No emergency contacts added yet
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3 flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add New Contact
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="Contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                        placeholder="Family, Friend, etc."
                      />
                    </div>
                    <Button onClick={handleAddContact} className="w-full mt-2">
                      Add Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Emergency Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Emergency Preferences
              </CardTitle>
              <CardDescription>
                Configure how the app should behave in emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-location">Share Location</Label>
                    <p className="text-sm text-gray-500">
                      Share your live location with emergency contacts
                    </p>
                  </div>
                  <Switch
                    id="share-location"
                    checked={settings.shareLocationInEmergency}
                    onCheckedChange={(checked) => handleSettingChange('shareLocationInEmergency', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="silent-alert">Silent Emergency Alert</Label>
                    <p className="text-sm text-gray-500">
                      Trigger emergency without making any sound
                    </p>
                  </div>
                  <Switch
                    id="silent-alert"
                    checked={settings.silentEmergencyAlert}
                    onCheckedChange={(checked) => handleSettingChange('silentEmergencyAlert', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-detection">Automatic Emergency Detection</Label>
                    <p className="text-sm text-gray-500">
                      Detect potential emergencies based on unusual activity
                    </p>
                  </div>
                  <Switch
                    id="auto-detection"
                    checked={settings.automaticEmergencyDetection}
                    onCheckedChange={(checked) => handleSettingChange('automaticEmergencyDetection', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="police-alert">Police Auto Alert</Label>
                    <p className="text-sm text-gray-500">
                      Automatically alert police in emergency situations
                    </p>
                  </div>
                  <Switch
                    id="police-alert"
                    checked={settings.policeAutoAlert}
                    onCheckedChange={(checked) => handleSettingChange('policeAutoAlert', checked)}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3 flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Emergency Meeting Point
                  </h3>
                  <div className="space-y-3">
                    <Input placeholder="Enter address for emergency meeting point" />
                    <div className="h-24 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                      Map preview would appear here
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSaveSettings} className="flex items-center">
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencySettings;
