
import { Request, Response } from 'express';

export const bookRide = async (req: Request, res: Response) => {
  try {
    const { userId, pickupLocation, destination, rideType, paymentMethod, options } = req.body;
    
    // Generate a ride ID
    const rideId = Math.random().toString(36).substring(2, 15);
    
    // Mock response with created ride
    return res.status(201).json({
      success: true,
      ride: {
        id: rideId,
        userId,
        startLocation: {
          address: pickupLocation,
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        },
        endLocation: {
          address: destination,
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        },
        status: "pending",
        fare: Math.floor(Math.random() * 50) + 10,
        distance: Math.floor(Math.random() * 20) + 1,
        duration: Math.floor(Math.random() * 60) + 10,
        rideType,
        paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...options
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to book ride"
    });
  }
};

export const getRideById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response with ride details
    return res.status(200).json({
      success: true,
      ride: {
        id,
        userId: "user123",
        driverId: "driver456",
        startLocation: {
          address: "123 Main St, City",
          lat: 37.7749,
          lng: -122.4194
        },
        endLocation: {
          address: "456 Market St, City",
          lat: 37.7835,
          lng: -122.4089
        },
        status: "in_progress",
        fare: 25.50,
        distance: 5.2,
        duration: 15,
        rideType: "standard",
        paymentMethod: "card",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get ride details"
    });
  }
};

export const getUserRides = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Generate 3 mock rides
    const rides = Array(3).fill(null).map((_, index) => ({
      id: `ride${index + 1}`,
      userId,
      driverId: `driver${index + 1}`,
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
      status: ["completed", "in_progress", "pending"][index],
      fare: Math.floor(Math.random() * 50) + 10,
      distance: Math.floor(Math.random() * 20) + 1,
      duration: Math.floor(Math.random() * 60) + 10,
      rideType: ["standard", "premium", "eco"][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - index * 86400000), // Each ride 1 day apart
      updatedAt: new Date(Date.now() - index * 86400000)
    }));
    
    return res.status(200).json({
      success: true,
      rides
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get user rides"
    });
  }
};

export const updateRideStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    return res.status(200).json({
      success: true,
      message: `Ride status updated to ${status}`,
      ride: {
        id,
        status,
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update ride status"
    });
  }
};

export const rateRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;
    
    return res.status(200).json({
      success: true,
      message: "Ride rated successfully",
      ride: {
        id,
        userRating: rating,
        feedback,
        isRated: true,
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to rate ride"
    });
  }
};

export const cancelRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      message: "Ride cancelled successfully",
      ride: {
        id,
        status: "cancelled",
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel ride"
    });
  }
};

export const applyRidesharingDiscount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { discountPercent } = req.body;
    
    return res.status(200).json({
      success: true,
      message: `${discountPercent}% ridesharing discount applied`,
      ride: {
        id,
        appliedDiscount: discountPercent / 100,
        isShared: true,
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to apply ridesharing discount"
    });
  }
};

export const addStopToRide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { address } = req.body;
    
    const stopId = Math.random().toString(36).substring(2, 15);
    
    return res.status(201).json({
      success: true,
      message: "Stop added to ride",
      stop: {
        id: stopId,
        rideId: id,
        address,
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
        order: 1,
        isCompleted: false,
        createdAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to add stop to ride"
    });
  }
};

export const changeRideDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { destination } = req.body;
    
    return res.status(200).json({
      success: true,
      message: "Ride destination updated",
      ride: {
        id,
        endLocation: {
          address: destination,
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180
        },
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to change ride destination"
    });
  }
};

export const generateSplitPaymentLink = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      link: `https://gocabs.app/split-payment/${id}/${Math.random().toString(36).substring(2, 15)}`,
      amount: Math.floor(Math.random() * 50) + 10
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate split payment link"
    });
  }
};
