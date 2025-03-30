
import { Request, Response } from 'express';
import axios from 'axios';
import { pool } from '../../config/database';

// You would normally use a real weather API like OpenWeatherMap
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'your_api_key';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherCondition = async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    
    // For demo purposes, we'll use a simple mapping of conditions
    // In production, you would call an actual weather API
    const response = await axios.get(
      `${WEATHER_API_URL}/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    // Map OpenWeatherMap conditions to our app's conditions
    const weatherId = response.data.weather[0].id;
    let condition = 'clear';
    
    if (weatherId >= 200 && weatherId < 300) condition = 'storm';
    else if (weatherId >= 300 && weatherId < 600) condition = 'rain';
    else if (weatherId >= 600 && weatherId < 700) condition = 'snow';
    else if (weatherId >= 700 && weatherId < 800) condition = 'cloudy';
    else if (weatherId === 800) condition = 'clear';
    else if (weatherId > 800) condition = 'cloudy';
    
    res.json({ condition });
  } catch (error) {
    console.error('Weather API error:', error);
    // Fallback to a default condition
    res.json({ condition: 'clear' });
  }
};

export const getWeatherForecast = async (req: Request, res: Response) => {
  try {
    const { location } = req.params;
    const { time } = req.query;
    
    // Call to a weather API for forecast data
    const response = await axios.get(
      `${WEATHER_API_URL}/forecast?q=${location}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    // Process the forecast data
    // For simplicity, we're just returning the first forecast item
    const forecast = response.data.list[0];
    
    res.json({
      condition: forecast.weather[0].main.toLowerCase(),
      temperature: forecast.main.temp,
      humidity: forecast.main.humidity,
      windSpeed: forecast.wind.speed
    });
  } catch (error) {
    console.error('Weather forecast API error:', error);
    // Return mock data as fallback
    res.json({
      condition: 'clear',
      temperature: 20,
      humidity: 50,
      windSpeed: 5
    });
  }
};

export const getWeatherAdjustment = (req: Request, res: Response) => {
  const { condition } = req.params;
  
  let adjustment = 0;
  
  switch (condition) {
    case 'clear':
      adjustment = -0.05; // 5% discount on nice days
      break;
    case 'cloudy':
      adjustment = 0; // No adjustment
      break;
    case 'rain':
      adjustment = 0.1; // 10% increase in rain
      break;
    case 'snow':
      adjustment = 0.15; // 15% increase in snow
      break;
    case 'storm':
      adjustment = 0.2; // 20% increase in storms
      break;
    default:
      adjustment = 0;
  }
  
  res.json({ adjustment });
};
