
import axios from 'axios';

export interface WeatherCondition {
  location: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  recordedAt: Date;
}

export interface WeatherForecast {
  day: string;
  condition: string;
  high: number;
  low: number;
}

// Get current weather for a location
export const getCurrentWeather = async (location: string): Promise<WeatherCondition> => {
  try {
    const response = await axios.get(`/api/weather/current/${encodeURIComponent(location)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw new Error('Failed to fetch current weather');
  }
};

// Get weather forecast for a location
export const getWeatherForecast = async (location: string): Promise<WeatherForecast[]> => {
  try {
    const response = await axios.get(`/api/weather/forecast/${encodeURIComponent(location)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw new Error('Failed to fetch weather forecast');
  }
};

// Get weather adjustment for a condition
export const getWeatherAdjustment = async (condition: string): Promise<number> => {
  try {
    const response = await axios.get(`/api/weather/adjustment/${encodeURIComponent(condition)}`);
    return response.data.data.adjustment;
  } catch (error) {
    console.error('Error calculating weather adjustment:', error);
    throw new Error('Failed to calculate weather adjustment');
  }
};

// Add a simple pricing adjustment calculation for weather
export const weatherService = {
  getCurrentWeather: async (location: string): Promise<string> => {
    // This would call an actual weather API in a real implementation
    const conditions = ['clear', 'cloudy', 'rainy', 'snowy', 'windy', 'stormy'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  },
  
  getPriceAdjustmentForWeather: (condition: string): number => {
    switch (condition.toLowerCase()) {
      case 'rainy':
        return 1.15; // 15% surge
      case 'snowy':
        return 1.25; // 25% surge
      case 'stormy':
        return 1.35; // 35% surge
      case 'clear':
        return 0.95; // 5% discount on nice days
      default:
        return 1.0; // No adjustment
    }
  }
};
