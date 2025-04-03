
import { testConnection } from "./database";

// Simple database interface for services
export const db = {
  query: async (table: string, filters: any = {}) => {
    // Implementation would go here
    return [];
  },
  getById: async (table: string, id: string) => {
    // Implementation would go here
    return null;
  },
  insert: async (table: string, data: any) => {
    // Implementation would go here
    return data;
  },
  update: async (table: string, id: string, data: any) => {
    // Implementation would go here
    return data;
  },
  delete: async (table: string, id: string) => {
    // Implementation would go here
    return true;
  }
};

// Export the testConnection function
export { testConnection };
