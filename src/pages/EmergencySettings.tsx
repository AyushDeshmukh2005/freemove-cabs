
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Plus, User, Phone, Heart, Trash2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { emergencyService, EmergencyContact } from '@/services/emergencyService';
import { Skeleton } from '@/components/ui/skeleton';

const EmergencySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContactDialogOpen, setNewContactDialogOpen] = useState(false);
  const [deletingContact, setDeletingContact] = useState<string | null>(null);
  
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  
  // Load contacts
  useEffect(() => {
    const loadContacts = async () => {
      if (!user) return;
      
      try {
        const userContacts = await emergencyService.getUserEmergencyContacts(user.id);
        setContacts(userContacts);
      } catch (error) {
        toast({
          title: "Failed to Load Contacts",
          description: "There was an error loading your emergency contacts.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadContacts();
  }, [user, toast]);
  
  const handleAddContact = async () => {
    if (!user) return;
    
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and phone number.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const contact = await emergencyService.addEmergencyContact({
        userId: user.id,
        name: newContact.name,
        phone: newContact.phone,
        relationship: newContact.relationship
      });
      
      setContacts(prev => [...prev, contact]);
      setNewContactDialogOpen(false);
      
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
      });
      
      // Reset form
      setNewContact({
        name: '',
        phone: '',
        relationship: ''
      });
    } catch (error) {
      toast({
        title: "Failed to Add Contact",
        description: "There was an error adding your emergency contact.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteContact = async (contactId: string) => {
    try {
      setDeletingContact(contactId);
      const success = await emergencyService.deleteEmergencyContact(contactId);
      
      if (success) {
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
        
        toast({
          title: "Contact Removed",
          description: "Emergency contact has been removed successfully.",
        });
      }
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to remove the emergency contact.",
        variant: "destructive",
      });
    } finally {
      setDeletingContact(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gocabs-dark p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Emergency Settings</h1>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gocabs-secondary/30 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Emergency SOS Features
            </h2>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            In case of an emergency during a ride, GoCabs provides an SOS feature that sends your real-time location to your trusted contacts and notifies our support team.
          </p>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">How It Works:</h3>
            <ul className="list-disc text-sm text-red-700 dark:text-red-300 pl-5 space-y-1">
              <li>Tap the Emergency SOS button during an active ride</li>
              <li>Your emergency contacts receive an SMS with your location</li>
              <li>GoCabs support team is immediately notified</li>
              <li>Your driver receives an alert about the emergency</li>
              <li>We track your location in real-time until help arrives</li>
            </ul>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-gray-800 dark:text-white">
              Your Emergency Contacts
            </h3>
            <Button 
              size="sm"
              onClick={() => setNewContactDialogOpen(true)}
              disabled={contacts.length >= 3}
              className="bg-gocabs-primary hover:bg-gocabs-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You haven't added any emergency contacts yet.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setNewContactDialogOpen(true)}
              >
                Add Your First Contact
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                        <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-white">{contact.name}</h4>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <Phone className="h-3 w-3 mr-1" /> {contact.phone}
                        </div>
                        {contact.relationship && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Heart className="h-3 w-3 mr-1" /> {contact.relationship}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-500 hover:text-red-500"
                      onClick={() => handleDeleteContact(contact.id)}
                      disabled={deletingContact === contact.id}
                    >
                      {deletingContact === contact.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              {contacts.length < 3 && (
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    You can add up to {3 - contacts.length} more contact{contacts.length === 2 ? '' : 's'}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* New Contact Dialog */}
      <Dialog open={newContactDialogOpen} onOpenChange={setNewContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Emergency Contact</DialogTitle>
            <DialogDescription>
              Add someone you trust who can be contacted in case of emergency.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input 
                id="contact-name" 
                value={newContact.name} 
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contact-phone">Phone Number</Label>
              <Input 
                id="contact-phone" 
                value={newContact.phone} 
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contact-relationship">Relationship (Optional)</Label>
              <Input 
                id="contact-relationship" 
                value={newContact.relationship} 
                onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                placeholder="Family, Friend, etc."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setNewContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddContact} className="bg-gocabs-primary hover:bg-gocabs-primary/90">
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencySettings;
