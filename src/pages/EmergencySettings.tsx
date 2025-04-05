
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Phone, Users, Shield, MapPin } from 'lucide-react';

const EmergencySettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    enableEmergencyContacts: true,
    shareLocationWithEmergencyContacts: true,
    enableSOS: true,
    enableAutomatedEmergencyCall: false,
    contacts: [
      { name: 'John Doe', phone: '+1 202-555-0149', relationship: 'Family' },
      { name: 'Jane Smith', phone: '+1 202-555-0187', relationship: 'Friend' }
    ]
  });
  
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  
  const [showAddContact, setShowAddContact] = useState(false);
  
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleRemoveContact = (index: number) => {
    const updatedContacts = [...settings.contacts];
    updatedContacts.splice(index, 1);
    setSettings({
      ...settings,
      contacts: updatedContacts
    });
  };
  
  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    
    setSettings({
      ...settings,
      contacts: [...settings.contacts, newContact]
    });
    
    setNewContact({
      name: '',
      phone: '',
      relationship: ''
    });
    
    setShowAddContact(false);
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Settings saved",
        description: "Your emergency settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to save",
        description: "There was a problem saving your emergency settings.",
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
          <h1 className="text-2xl font-bold dark:text-white">Emergency Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Configure your emergency contacts and safety preferences
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              Emergency Features
            </CardTitle>
            <CardDescription>
              Set up emergency features for urgent situations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="sos-toggle" className="font-medium">SOS Button</Label>
                <p className="text-sm text-gray-500">Quick access to emergency services</p>
              </div>
              <Switch
                id="sos-toggle"
                checked={settings.enableSOS}
                onCheckedChange={() => handleToggle('enableSOS')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-call-toggle" className="font-medium">Automated Emergency Call</Label>
                <p className="text-sm text-gray-500">Auto-call emergency services in case of detected accident</p>
              </div>
              <Switch
                id="auto-call-toggle"
                checked={settings.enableAutomatedEmergencyCall}
                onCheckedChange={() => handleToggle('enableAutomatedEmergencyCall')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location-toggle" className="font-medium">Share Location</Label>
                <p className="text-sm text-gray-500">Share your live location with emergency contacts</p>
              </div>
              <Switch
                id="location-toggle"
                checked={settings.shareLocationWithEmergencyContacts}
                onCheckedChange={() => handleToggle('shareLocationWithEmergencyContacts')}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Emergency Contacts
            </CardTitle>
            <CardDescription>
              People to notify during emergency situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Label htmlFor="contacts-toggle" className="font-medium">Enable Emergency Contacts</Label>
              <Switch
                id="contacts-toggle"
                checked={settings.enableEmergencyContacts}
                onCheckedChange={() => handleToggle('enableEmergencyContacts')}
              />
            </div>
            
            {settings.enableEmergencyContacts && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {settings.contacts.map((contact, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{contact.phone}</span>
                        </div>
                        {contact.relationship && (
                          <p className="text-xs text-gray-400 mt-1">
                            {contact.relationship}
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => handleRemoveContact(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                {showAddContact ? (
                  <div className="border rounded-md p-3 space-y-3">
                    <h4 className="font-medium text-sm">Add New Contact</h4>
                    <div className="space-y-2">
                      <Input
                        placeholder="Full Name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      />
                      <Input
                        placeholder="Phone Number"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      />
                      <Input
                        placeholder="Relationship (optional)"
                        value={newContact.relationship}
                        onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleAddContact}>Add Contact</Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setShowAddContact(false);
                          setNewContact({name: '', phone: '', relationship: ''});
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowAddContact(true)}
                  >
                    + Add Emergency Contact
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Trusted Locations
            </CardTitle>
            <CardDescription>
              Locations that are considered safe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 border rounded-md">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <div className="flex-1">
                <p className="font-medium">Home</p>
                <p className="text-sm text-gray-500">123 Main St, New York, NY 10001</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            
            <div className="flex items-center p-3 border rounded-md">
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <div className="flex-1">
                <p className="font-medium">Work</p>
                <p className="text-sm text-gray-500">456 Business Ave, New York, NY 10002</p>
              </div>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
            
            <Button variant="outline" className="w-full">
              + Add Trusted Location
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Emergency Settings"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmergencySettings;
