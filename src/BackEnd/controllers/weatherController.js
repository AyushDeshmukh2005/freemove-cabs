
const { pool } = require('../Database/database');

// Get current weather condition for a location
const getWeatherCondition = async (req, res) => {
  try {
    const { location } = req.params;
    
    // In a real app, fetch from weather API
    // For now, simulate with dummy data
    const weatherData = {
      location,
      condition: 'Sunny',
      temperature: 75.5,
      humidity: 60,
      windSpeed: 10.2,
      recordedAt: new Date()
    };
    
    return res.status(200).json({ success: true, data: weatherData });
  } catch (error) {
    console.error('Error fetching weather condition:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch weather data' });
  }
};

// Get weather forecast for a location
const getWeatherForecast = async (req, res) => {
  try {
    const { location } = req.params;
    
    // In a real app, fetch from weather API
    // For now, simulate with dummy data
    const forecast = [
      { day: 'Today', condition: 'Sunny', high: 78, low: 65 },
      { day: 'Tomorrow', condition: 'Partly Cloudy', high: 75, low: 62 },
      { day: 'Wednesday', condition: 'Rainy', high: 68, low: 60 }
    ];
    
    return res.status(200).json({ success: true, data: forecast });
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch weather forecast' });
  }
};

// Get ride price adjustment based on weather condition
const getWeatherAdjustment = async (req, res) => {
  try {
    const { condition } = req.params;
    
    // Apply adjustment factor based on weather condition
    let adjustment = 0;
    
    switch (condition.toLowerCase()) {
      case 'rainy':
        adjustment = 1.2; // 20% increase
        break;
      case 'snowy':
        adjustment = 1.5; // 50% increase
        break;
      case 'stormy':
        adjustment = 1.8; // 80% increase
        break;
      default:
        adjustment = 1.0; // No adjustment
    }
    
    return res.status(200).json({ success: true, data: { adjustment } });
  } catch (error) {
    console.error('Error calculating weather adjustment:', error);
    return res.status(500).json({ success: false, message: 'Failed to calculate weather adjustment' });
  }
};

module.exports = {
  getWeatherCondition,
  getWeatherForecast,
  getWeatherAdjustment
};
