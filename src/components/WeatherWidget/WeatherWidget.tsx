import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Sun, CloudSnow, Wind, Droplets, MapPin } from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import type { WeatherData } from '../../types/index';
import { Card, CardContent } from '../ui/card';
import { cn } from '../../lib/utils';

interface WeatherWidgetProps {
  location?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location = 'São Paulo' }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    fetchWeather();
  }, [location]);

  const fetchWeather = async () => {
    setLoading(true);
    const data = await weatherService.getCurrentWeather(location);
    
    if (data) {
      setWeather(data);
      const weatherSuggestion = await weatherService.getWeatherSuggestion(data);
      setSuggestion(weatherSuggestion);
    }
    
    setLoading(false);
  };

  const getWeatherIcon = (description: string) => {
    const iconClass = "h-10 w-10";
    if (description.includes('rain')) return <CloudRain className={cn(iconClass, "text-blue-500")} />;
    if (description.includes('cloud')) return <Cloud className={cn(iconClass, "text-gray-500")} />;
    if (description.includes('snow')) return <CloudSnow className={cn(iconClass, "text-blue-300")} />;
    return <Sun className={cn(iconClass, "text-yellow-500")} />;
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-8 bg-muted rounded animate-pulse w-32" />
            <div className="h-3 bg-muted rounded animate-pulse w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{location}</span>
            </div>
            <span className="text-xs text-muted-foreground">Now</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getWeatherIcon(weather.description)}
              <div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{weather.temp}</span>
                  <span className="text-lg text-muted-foreground ml-1">°C</span>
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  {weather.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 pt-2 border-t">
            <div className="flex items-center gap-1.5">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{weather.windSpeed} m/s</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Droplets className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{weather.humidity}%</span>
            </div>
          </div>
          
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="pt-3 border-t"
            >
              <p className="text-xs text-muted-foreground italic">
                {suggestion}
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeatherWidget;