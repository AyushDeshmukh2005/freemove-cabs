
import { Request, Response } from 'express';

export const registerUser = async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would handle user registration with database
    const { name, email, password } = req.body;
    
    // For demo purposes, return a mock response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: Math.random().toString(36).substring(2, 15), name, email }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during registration"
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would verify credentials against a database
    const { email, password } = req.body;
    
    // For demo purposes, return a mock response with a token
    return res.status(200).json({
      success: true,
      token: "mock-jwt-token",
      user: { 
        id: Math.random().toString(36).substring(2, 15),
        email,
        name: "Test User" 
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred during login"
    });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // For demo purposes, return a mock user profile
    return res.status(200).json({
      success: true,
      user: {
        id,
        name: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        profilePicture: "https://i.pravatar.cc/300",
        createdAt: new Date(),
        preferredPayment: "card"
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred fetching user profile"
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // For demo purposes, return a mock updated profile
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id,
        ...updateData,
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred updating user profile"
    });
  }
};

export const updateQuietHours = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { enabled, startTime, endTime, daysOfWeek } = req.body;
    
    // For demo purposes, return a mock response
    return res.status(200).json({
      success: true,
      message: "Quiet hours updated successfully",
      quietHours: {
        id: Math.random().toString(36).substring(2, 15),
        userId: id,
        enabled,
        startTime,
        endTime,
        daysOfWeek,
        updatedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred updating quiet hours"
    });
  }
};
