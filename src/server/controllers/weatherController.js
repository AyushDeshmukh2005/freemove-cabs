
const axios = require('axios');
const { pool } = require('../database/database');

// Get current weather condition
const getWeatherCondition = async (req, res) => {
  try {
    const { location } = req.params;
    
    // Check if we have cached weather data for this location
    const [cachedData] = await pool.execute(
      `SELECT * FROM weather_data 
       WHERE location = ? 
       AND recordedAt > DATE_SUB(NOW(), INTERVAL 30 MINUTE)
       ORDER BY recordedAt DESC LIMIT 1`,
      [location]
    );
    
    if (cachedData.length > 0) {
      return res.json({ weather: cachedData[0] });
    }
    
    // If no cached data, fetch from weather API
    const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    const weatherData = {
      location: location,
      condition: response.data.weather[0].main,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      recordedAt: new Date()
    };
    
    // Cache the weather data
    await pool.execute(
      `INSERT INTO weather_data 
       (location, condition, temperature, humidity, windSpeed, recordedAt)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        weatherData.location,
        weatherData.condition,
        weatherData.temperature,
        weatherData.humidity,
        weatherData.windSpeed
      ]
    );
    
    res.json({ weather: weatherData });
  } catch (error) {
    console.error('Error getting weather condition:', error);
    res.status(500).json({ error: 'Failed to get weather condition' });
  }
};

// Get weather forecast
const getWeatherForecast = async (req, res) => {
  try {
    const { location } = req.params;
    
    // Fetch from weather API
    const apiKey = process.env.WEATHER_API_KEY || 'demo_key';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    );
    
    // Format the forecast data
    const forecast = response.data.list.slice(0, 8).map(item => ({
      time: item.dt_txt,
      condition: item.weather[0].main,
      temperature: item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }));
    
    res.json({ forecast });
  } catch (error) {
    console.error('Error getting weather forecast:', error);
    res.status(500).json({ error: 'Failed to get weather forecast' });
  }
};

// Get price adjustment based on weather condition
const getWeatherAdjustment = async (req, res) => {
  try {
    const { condition } = req.params;
    
    // Calculate price adjustment based on weather condition
    let adjustment = 1.0; // Default: no adjustment
    
    switch (condition.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        adjustment = 1.2; // 20% increase
        break;
      case 'snow':
        adjustment = 1.35; // 35% increase
        break;
      case 'thunderstorm':
        adjustment = 1.5; // 50% increase
        break;
      case 'fog':
      case 'mist':
        adjustment = 1.15; // 15% increase
        break;
      default:
        adjustment = 1.0;
    }
    
    res.json({ adjustment });
  } catch (error) {
    console.error('Error getting weather adjustment:', error);
    res.status(500).json({ error: 'Failed to get weather adjustment' });
  }
};

module.exports = {
  getWeatherCondition,
  getWeatherForecast,
  getWeatherAdjustment
};
