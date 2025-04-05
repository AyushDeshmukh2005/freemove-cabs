
import { Request, Response } from 'express';

export const getWeatherCondition = async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    
    // Mock weather data for demo purposes
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'foggy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return res.status(200).json({
      success: true,
      data: {
        location,
        condition,
        temperature: Math.floor(Math.random() * 35) + 5, // Random temp between 5-40°C
        humidity: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 30),
        recordedAt: new Date()
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch weather condition"
    });
  }
};

export const getWeatherForecast = async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'foggy'];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Generate a 7-day forecast
    const forecast = days.map(day => ({
      day,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      high: Math.floor(Math.random() * 15) + 20, // High temp between 20-35°C
      low: Math.floor(Math.random() * 15) + 5 // Low temp between 5-20°C
    }));
    
    return res.status(200).json({
      success: true,
      data: forecast,
      location
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch weather forecast"
    });
  }
};

export const getWeatherAdjustment = async (req: Request, res: Response) => {
  try {
    const { condition } = req.params;
    
    // Calculate price adjustment factor based on weather condition
    let adjustment = 0;
    
    switch(condition.toLowerCase()) {
      case 'rainy':
        adjustment = 0.15; // 15% surge
        break;
      case 'snowy':
        adjustment = 0.25; // 25% surge
        break;
      case 'foggy':
        adjustment = 0.10; // 10% surge
        break;
      case 'windy':
        adjustment = 0.05; // 5% surge
        break;
      case 'sunny':
        adjustment = -0.05; // 5% discount on nice days
        break;
      default:
        adjustment = 0; // No adjustment for cloudy or other conditions
    }
    
    return res.status(200).json({
      success: true,
      data: {
        condition,
        adjustment,
        message: adjustment > 0 
          ? `${(adjustment * 100).toFixed(0)}% surge applied due to ${condition} weather` 
          : adjustment < 0 
            ? `${(Math.abs(adjustment) * 100).toFixed(0)}% discount applied for ${condition} weather` 
            : "No price adjustment for current weather"
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate weather adjustment"
    });
  }
};
