
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  multipleStatements: true
};

async function setupDatabase() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection(dbConfig);
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'gocabs_db'}`);
    console.log('Database created or already exists');
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'gocabs_db'}`);
    console.log('Using database');
    
    // Read schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL
    await connection.query(schemaSql);
    console.log('Database schema created successfully');
    
    // Seed some initial data
    await seedInitialData(connection);
    console.log('Initial data seeded successfully');
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function seedInitialData(connection: mysql.Connection) {
  // Seed a few landmarks
  const landmarks = [
    ["Grand Central Station", "89 E 42nd St, New York, NY", 40.7527, -73.9772, "transportation"],
    ["Central Park", "Central Park, New York, NY", 40.7812, -73.9665, "park"],
    ["Empire State Building", "350 5th Ave, New York, NY", 40.7484, -73.9857, "landmark"],
    ["Times Square", "Times Square, New York, NY", 40.7580, -73.9855, "tourist"],
    ["Statue of Liberty", "Liberty Island, New York, NY", 40.6892, -74.0445, "landmark"]
  ];
  
  await connection.query(`
    INSERT INTO landmarks (name, address, lat, lng, category, createdAt)
    VALUES 
      (?, ?, ?, ?, ?, NOW()),
      (?, ?, ?, ?, ?, NOW()),
      (?, ?, ?, ?, ?, NOW()),
      (?, ?, ?, ?, ?, NOW()),
      (?, ?, ?, ?, ?, NOW())
  `, landmarks.flat());
}

// Run the setup
setupDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error during database setup:', error);
    process.exit(1);
  });
