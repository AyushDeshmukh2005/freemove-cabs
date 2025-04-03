
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
