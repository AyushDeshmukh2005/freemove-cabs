
import { toast } from "@/hooks/use-toast";
import { databaseService } from "./databaseService";

export type EmergencyContact = {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
};

// Mock emergency service API
const mockEmergencyAPI = {
  sendAlert: (userId: string, location: { lat: number, lng: number }, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`EMERGENCY: User ${userId} at location ${location.lat},${location.lng}: ${message}`);
        resolve(true);
      }, 1000);
    });
  }
};

export const emergencyService = {
  // Get emergency contacts for a user
  getUserEmergencyContacts: (userId: string): Promise<EmergencyContact[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contacts = databaseService.getAll<EmergencyContact>("emergencyContacts")
          .filter(contact => contact.userId === userId);
        resolve(contacts);
      }, 300);
    });
  },

  // Add an emergency contact
  addEmergencyContact: (contact: Omit<EmergencyContact, "id">): Promise<EmergencyContact> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = Math.random().toString(36).substring(2, 15);
        const newContact = { ...contact, id };
        const result = databaseService.add<EmergencyContact>("emergencyContacts", id, newContact);
        resolve(result);
      }, 300);
    });
  },

  // Delete an emergency contact
  deleteEmergencyContact: (contactId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = databaseService.delete("emergencyContacts", contactId);
        resolve(result);
      }, 300);
    });
  },

  // Send emergency alert
  sendEmergencyAlert: async (
    userId: string, 
    location: { lat: number, lng: number }, 
    message: string = "Emergency assistance needed"
  ): Promise<boolean> => {
    try {
      // 1. Send alert to emergency contacts
      const contacts = await emergencyService.getUserEmergencyContacts(userId);
      console.log(`Emergency alert sent to ${contacts.length} contacts`);
      
      // 2. Send alert to emergency services
      const result = await mockEmergencyAPI.sendAlert(userId, location, message);
      
      // 3. Notify GoCabs support
      console.log("Emergency alert sent to GoCabs support team");
      
      toast({
        title: "Emergency Alert Sent",
        description: "Help is on the way. Stay calm and remain in your location if safe to do so.",
        variant: "destructive",
      });
      
      return result;
    } catch (error) {
      console.error("Failed to send emergency alert:", error);
      toast({
        title: "Failed to Send Alert",
        description: "Please try again or call emergency services directly.",
        variant: "destructive",
      });
      return false;
    }
  }
};
