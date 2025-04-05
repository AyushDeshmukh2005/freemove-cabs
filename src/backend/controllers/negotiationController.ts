
import { Request, Response } from 'express';

export const createNegotiation = async (req: Request, res: Response) => {
  try {
    const { rideId, userId, userOffer } = req.body;
    
    // Generate a negotiation ID
    const negotiationId = Math.random().toString(36).substring(2, 15);
    
    return res.status(201).json({
      success: true,
      negotiation: {
        id: negotiationId,
        rideId,
        userId,
        userOffer,
        status: "pending",
        createdAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create negotiation"
    });
  }
};

export const getRideNegotiations = async (req: Request, res: Response) => {
  try {
    const { rideId } = req.params;
    
    // Create a mock negotiation
    const negotiations = [{
      id: Math.random().toString(36).substring(2, 15),
      rideId,
      userId: "user123",
      userOffer: 20,
      driverId: "driver456",
      driverCounterOffer: 25,
      status: "countered",
      createdAt: new Date(Date.now() - 300000),
      updatedAt: new Date()
    }];
    
    return res.status(200).json({
      success: true,
      negotiations
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get ride negotiations"
    });
  }
};

export const respondToNegotiation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { driverId, response, counterOffer } = req.body;
    
    return res.status(200).json({
      success: true,
      message: `Driver ${response} the negotiation`,
      negotiation: {
        id,
        driverId,
        status: response,
        driverCounterOffer: counterOffer,
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to respond to negotiation"
    });
  }
};

export const acceptCounterOffer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    return res.status(200).json({
      success: true,
      message: "Counter offer accepted",
      negotiation: {
        id,
        status: "accepted",
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to accept counter offer"
    });
  }
};
