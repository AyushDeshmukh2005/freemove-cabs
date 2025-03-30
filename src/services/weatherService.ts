
// Weather service for getting current weather conditions
// This now connects to our real backend API

type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm';

interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

// API base URL
const API_URL = 'http://localhost:5000/api';

export const weatherService = {
  // Get current weather for a location
  getCurrentWeather: async (location: string): Promise<WeatherCondition> => {
    try {
      const response = await fetch(`${API_URL}/weather/current/${encodeURIComponent(location)}`);
      const data = await response.json();
      return data.condition;
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Return default weather on error
      return 'clear';
    }
  },
  
  // Get price adjustment factor based on weather condition
  getPriceAdjustmentForWeather: async (weatherCondition: string): Promise<number> => {
    try {
      const response = await fetch(`${API_URL}/weather/adjustment/${weatherCondition}`);
      const data = await response.json();
      return data.adjustment;
    } catch (error) {
      console.error('Error fetching weather adjustment:', error);
      
      // Fallback to local calculation if API fails
      switch (weatherCondition) {
        case 'clear':
          return -0.05; // 5% discount on nice days
        case 'cloudy':
          return 0; // No adjustment
        case 'rain':
          return 0.1; // 10% increase in rain
        case 'snow':
          return 0.15; // 15% increase in snow
        case 'storm':
          return 0.2; // 20% increase in storms
        default:
          return 0;
      }
    }
  },
  
  // Get forecasted weather for a specific time
  getForecastedWeather: async (location: string, time: Date): Promise<WeatherData> => {
    try {
      const response = await fetch(
        `${API_URL}/weather/forecast/${encodeURIComponent(location)}?time=${time.toISOString()}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      // Return mock data as fallback
      return {
        condition: 'clear',
        temperature: 20,
        humidity: 50,
        windSpeed: 5
      };
    }
  }
};
