
// Mock weather service for getting current weather conditions
// In a real app, this would connect to a weather API like OpenWeatherMap, AccuWeather, etc.

type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm';

interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

// Mock database of current weather for different locations
const locationWeather: Record<string, WeatherData> = {};

// Helper to generate random weather data
const generateRandomWeather = (): WeatherData => {
  const conditions: WeatherCondition[] = ['clear', 'cloudy', 'rain', 'snow', 'storm'];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    condition: randomCondition,
    temperature: Math.floor(Math.random() * 35) - 5, // -5 to 30 degrees
    humidity: Math.floor(Math.random() * 100),
    windSpeed: Math.floor(Math.random() * 30)
  };
};

export const weatherService = {
  // Get current weather for a location
  getCurrentWeather: async (location: string): Promise<WeatherCondition> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Either use cached weather or generate new weather data
        if (!locationWeather[location]) {
          locationWeather[location] = generateRandomWeather();
        }
        
        resolve(locationWeather[location].condition);
      }, 200);
    });
  },
  
  // Get price adjustment factor based on weather condition
  getPriceAdjustmentForWeather: (weatherCondition: string): number => {
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
  },
  
  // Get forecasted weather for a specific time
  getForecastedWeather: async (location: string, time: Date): Promise<WeatherData> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateRandomWeather());
      }, 200);
    });
  }
};
