
// Mock database service for storing app data
// In a real app, this would connect to a real database

// Store data in-memory with type safety
interface Database {
  users: Record<string, any>;
  rides: Record<string, any>;
  driverRewards: Record<string, any>;
  emergencyContacts: Record<string, any>;
  themePreferences: Record<string, any>;
}

// Initialize in-memory database
const db: Database = {
  users: {},
  rides: {},
  driverRewards: {},
  emergencyContacts: {},
  themePreferences: {}
};

export const databaseService = {
  // Generic methods for CRUD operations
  get: <T>(collection: keyof Database, id: string): T | null => {
    const result = db[collection][id];
    return result ? JSON.parse(JSON.stringify(result)) : null;
  },
  
  getAll: <T>(collection: keyof Database): T[] => {
    return Object.values(db[collection]);
  },
  
  add: <T>(collection: keyof Database, id: string, data: T): T => {
    db[collection][id] = data;
    return JSON.parse(JSON.stringify(data));
  },
  
  update: <T>(collection: keyof Database, id: string, data: Partial<T>): T | null => {
    if (!db[collection][id]) return null;
    db[collection][id] = { ...db[collection][id], ...data };
    return JSON.parse(JSON.stringify(db[collection][id]));
  },
  
  delete: (collection: keyof Database, id: string): boolean => {
    if (!db[collection][id]) return false;
    delete db[collection][id];
    return true;
  }
};
