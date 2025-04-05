
import { Request, Response } from 'express';

export const saveFavoriteRoute = async (req: Request, res: Response) => {
  try {
    const { userId, name, startLocation, endLocation } = req.body;
    
    // Generate a favorite route ID
    const favoriteId = Math.random().toString(36).substring(2, 15);
    
    return res.status(201).json({
      success: true,
      route: {
        id: favoriteId,
        userId,
        name,
        startLocation,
        endLocation,
        createdAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save favorite route"
    });
  }
};

export const getFavoriteRoutes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Generate 3 mock favorite routes
    const routes = Array(3).fill(null).map((_, index) => ({
      id: `favorite${index + 1}`,
      userId,
      name: `Route ${index + 1}`,
      startLocation: {
        address: "123 Main St, City",
        lat: 37.7749 + (Math.random() * 0.01),
        lng: -122.4194 + (Math.random() * 0.01)
      },
      endLocation: {
        address: "456 Market St, City",
        lat: 37.7835 + (Math.random() * 0.01),
        lng: -122.4089 + (Math.random() * 0.01)
      },
      createdAt: new Date(Date.now() - index * 86400000) // Each route 1 day apart
    }));
    
    return res.status(200).json({
      success: true,
      routes
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get favorite routes"
    });
  }
};

export const deleteFavoriteRoute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      message: "Favorite route deleted successfully",
      id
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete favorite route"
    });
  }
};

export const saveFavoriteDriver = async (req: Request, res: Response) => {
  try {
    const { userId, driverId, note } = req.body;
    
    // Generate a favorite driver ID
    const favoriteId = Math.random().toString(36).substring(2, 15);
    
    return res.status(201).json({
      success: true,
      driver: {
        id: favoriteId,
        userId,
        driverId,
        note,
        createdAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to save favorite driver"
    });
  }
};

export const getFavoriteDrivers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Generate 2 mock favorite drivers
    const drivers = Array(2).fill(null).map((_, index) => ({
      id: `favorite${index + 1}`,
      userId,
      driverId: `driver${index + 1}`,
      driverName: `John Driver ${index + 1}`,
      driverRating: 4.5 + (Math.random() * 0.5),
      driverPhoto: `https://i.pravatar.cc/150?img=${index + 10}`,
      note: index === 0 ? "Great conversation" : "Knows the shortcuts",
      createdAt: new Date(Date.now() - index * 86400000) // Each driver 1 day apart
    }));
    
    return res.status(200).json({
      success: true,
      drivers
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get favorite drivers"
    });
  }
};

export const deleteFavoriteDriver = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      message: "Favorite driver deleted successfully",
      id
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete favorite driver"
    });
  }
};
