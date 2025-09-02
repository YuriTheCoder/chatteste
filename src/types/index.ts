export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  name?: string;
  location?: string;
  interests?: string[];
  notificationsEnabled?: boolean;
  autoSave?: boolean;
  language?: string;
}

export interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  datetime: string;
  completed: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'reminder' | 'event' | 'task';
  color?: string;
}