
import { Request, Response } from 'express';
import { pool } from '../../config/database';

// Save a favorite route
export const saveFavoriteRoute = async (req: Request, res: Response) => {
  try {
    const { userId, name, startLocation, endLocation } = req.body;
    
    // Insert into database
    const [result] = await pool.execute(
      `INSERT INTO favorite_routes (
        userId, name, startAddress, startLat, startLng, endAddress, endLat, endLng, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        userId,
        name,
        startLocation.address,
        startLocation.lat,
        startLocation.lng,
        endLocation.address,
        endLocation.lat,
        endLocation.lng
      ]
    );
    
    const routeId = (result as any).insertId;
    
    // Get the saved route
    const [rows] = await pool.execute(
      `SELECT * FROM favorite_routes WHERE id = ?`,
      [routeId]
    );
    
    // Format the response
    const route = (rows as any)[0];
    const formattedRoute = {
      id: route.id,
      userId: route.userId,
      name: route.name,
      startLocation: {
        address: route.startAddress,
        lat: route.startLat,
        lng: route.startLng
      },
      endLocation: {
        address: route.endAddress,
        lat: route.endLat,
        lng: route.endLng
      },
      createdAt: route.createdAt
    };
    
    res.status(201).json({ route: formattedRoute });
  } catch (error) {
    console.error('Error saving favorite route:', error);
    res.status(500).json({ error: 'Failed to save favorite route' });
  }
};

// Get favorite routes for a user
export const getFavoriteRoutes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Get from database
    const [rows] = await pool.execute(
      `SELECT * FROM favorite_routes WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
    
    // Format the response
    const routes = (rows as any).map((route: any) => ({
      id: route.id,
      userId: route.userId,
      name: route.name,
      startLocation: {
        address: route.startAddress,
        lat: route.startLat,
        lng: route.startLng
      },
      endLocation: {
        address: route.endAddress,
        lat: route.endLat,
        lng: route.endLng
      },
      createdAt: route.createdAt
    }));
    
    res.json({ routes });
  } catch (error) {
    console.error('Error getting favorite routes:', error);
    res.status(500).json({ error: 'Failed to get favorite routes' });
  }
};

// Delete a favorite route
export const deleteFavoriteRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Delete from database
    const [result] = await pool.execute(
      `DELETE FROM favorite_routes WHERE id = ?`,
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Favorite route not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite route:', error);
    res.status(500).json({ error: 'Failed to delete favorite route' });
  }
};

// Save a favorite driver
export const saveFavoriteDriver = async (req: Request, res: Response) => {
  try {
    const { userId, driverId } = req.body;
    
    // Check if already favorited
    const [existingRows] = await pool.execute(
      `SELECT * FROM favorite_drivers WHERE userId = ? AND driverId = ?`,
      [userId, driverId]
    );
    
    if ((existingRows as any).length > 0) {
      return res.status(400).json({ error: 'Driver already in favorites' });
    }
    
    // Insert into database
    const [result] = await pool.execute(
      `INSERT INTO favorite_drivers (userId, driverId, createdAt)
      VALUES (?, ?, NOW())`,
      [userId, driverId]
    );
    
    const favoriteId = (result as any).insertId;
    
    // Get the saved favorite
    const [rows] = await pool.execute(
      `SELECT * FROM favorite_drivers WHERE id = ?`,
      [favoriteId]
    );
    
    res.status(201).json({ favorite: (rows as any)[0] });
  } catch (error) {
    console.error('Error saving favorite driver:', error);
    res.status(500).json({ error: 'Failed to save favorite driver' });
  }
};

// Get favorite drivers for a user
export const getFavoriteDrivers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Get from database
    const [rows] = await pool.execute(
      `SELECT * FROM favorite_drivers WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );
    
    res.json({ favorites: rows });
  } catch (error) {
    console.error('Error getting favorite drivers:', error);
    res.status(500).json({ error: 'Failed to get favorite drivers' });
  }
};

// Delete a favorite driver
export const deleteFavoriteDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Delete from database
    const [result] = await pool.execute(
      `DELETE FROM favorite_drivers WHERE id = ?`,
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ error: 'Favorite driver not found' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting favorite driver:', error);
    res.status(500).json({ error: 'Failed to delete favorite driver' });
  }
};
