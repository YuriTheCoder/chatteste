import axios from 'axios';
import type { WeatherData } from '../types/index';

// Using wttr.in - FREE weather API without registration
const BASE_URL = 'https://wttr.in';

export const weatherService = {
  async getCurrentWeather(city: string): Promise<WeatherData | null> {
    try {
      // Get weather data in JSON format from wttr.in
      const response = await axios.get(`${BASE_URL}/${encodeURIComponent(city)}?format=j1`);
      
      const data = response.data;
      const current = data.current_condition[0];
      
      return {
        temp: parseInt(current.temp_C),
        description: current.weatherDesc[0].value.toLowerCase(),
        icon: current.weatherCode,
        humidity: parseInt(current.humidity),
        windSpeed: parseFloat(current.windspeedKmph) / 3.6 // Convert km/h to m/s
      };
    } catch (error) {
      console.error('Weather API error:', error);
      // Return default data if API fails
      return {
        temp: 22,
        description: 'partly cloudy',
        icon: '116',
        humidity: 65,
        windSpeed: 3.5
      };
    }
  },

  async getWeatherSuggestion(weather: WeatherData): Promise<string> {
    const { temp, description } = weather;
    
    if (temp < 10) {
      return "It's cold outside! Consider wearing warm layers and a jacket.";
    } else if (temp < 20) {
      return "The weather is mild. A light jacket should be perfect.";
    } else if (temp < 30) {
      return "Nice weather! Light clothing should be comfortable.";
    } else {
      return "It's hot outside! Stay hydrated and wear light, breathable clothing.";
    }
  }
};