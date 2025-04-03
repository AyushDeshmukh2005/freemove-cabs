
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'gocabs_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

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
