import type { Message, UserPreferences } from '../types/index';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  datetime: string;
  completed: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'reminder';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface Topic {
  id: string;
  name: string;
  count: number;
  lastUsed: string;
  keywords: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  topics: string[];
}

class StorageService {
  private readonly KEYS = {
    PREFERENCES: 'companion_preferences',
    MESSAGES: 'companion_messages',
    REMINDERS: 'companion_reminders',
    NOTIFICATIONS: 'companion_notifications',
    TOPICS: 'companion_topics',
    SESSIONS: 'companion_sessions',
    CURRENT_SESSION: 'companion_current_session',
    API_KEY: 'gemini_api_key',
    THEME: 'theme',
  };

  // Preferences
  getPreferences(): UserPreferences | null {
    const data = localStorage.getItem(this.KEYS.PREFERENCES);
    return data ? JSON.parse(data) : null;
  }

  savePreferences(preferences: UserPreferences): void {
    localStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(preferences));
  }

  // Messages & Sessions
  getCurrentSession(): ChatSession | null {
    const sessionId = localStorage.getItem(this.KEYS.CURRENT_SESSION);
    if (!sessionId) return null;
    
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  getAllSessions(): ChatSession[] {
    const data = localStorage.getItem(this.KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
  }

  saveSession(session: ChatSession): void {
    const sessions = this.getAllSessions();
    const index = sessions.findIndex(s => s.id === session.id);
    
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }
    
    localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
    localStorage.setItem(this.KEYS.CURRENT_SESSION, session.id);
  }

  createNewSession(title?: string): ChatSession {
    const session: ChatSession = {
      id: `session_${Date.now()}`,
      title: title || `Chat ${new Date().toLocaleDateString()}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      topics: [],
    };
    
    this.saveSession(session);
    return session;
  }

  deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions().filter(s => s.id !== sessionId);
    localStorage.setItem(this.KEYS.SESSIONS, JSON.stringify(sessions));
    
    const currentSessionId = localStorage.getItem(this.KEYS.CURRENT_SESSION);
    if (currentSessionId === sessionId) {
      localStorage.removeItem(this.KEYS.CURRENT_SESSION);
    }
  }

  // Reminders
  getReminders(): Reminder[] {
    const data = localStorage.getItem(this.KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  }

  saveReminder(reminder: Reminder): void {
    const reminders = this.getReminders();
    const index = reminders.findIndex(r => r.id === reminder.id);
    
    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }
    
    localStorage.setItem(this.KEYS.REMINDERS, JSON.stringify(reminders));
  }

  deleteReminder(reminderId: string): void {
    const reminders = this.getReminders().filter(r => r.id !== reminderId);
    localStorage.setItem(this.KEYS.REMINDERS, JSON.stringify(reminders));
  }

  // Notifications
  getNotifications(): Notification[] {
    const data = localStorage.getItem(this.KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  }

  saveNotification(notification: Notification): void {
    const notifications = this.getNotifications();
    notifications.unshift(notification); // Add to beginning
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50);
    }
    
    localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  markNotificationAsRead(notificationId: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
      notification.read = true;
      localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  clearNotifications(): void {
    localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify([]));
  }

  // Topics
  getTopics(): Topic[] {
    const data = localStorage.getItem(this.KEYS.TOPICS);
    return data ? JSON.parse(data) : [];
  }

  updateTopic(topicName: string, keywords: string[] = []): void {
    const topics = this.getTopics();
    const existingTopic = topics.find(t => t.name.toLowerCase() === topicName.toLowerCase());
    
    if (existingTopic) {
      existingTopic.count++;
      existingTopic.lastUsed = new Date().toISOString();
      existingTopic.keywords = [...new Set([...existingTopic.keywords, ...keywords])];
    } else {
      topics.push({
        id: `topic_${Date.now()}`,
        name: topicName,
        count: 1,
        lastUsed: new Date().toISOString(),
        keywords,
      });
    }
    
    // Sort by count and keep top 10
    topics.sort((a, b) => b.count - a.count);
    if (topics.length > 10) {
      topics.splice(10);
    }
    
    localStorage.setItem(this.KEYS.TOPICS, JSON.stringify(topics));
  }

  // Clear all data
  clearAllData(): void {
    Object.values(this.KEYS).forEach(key => {
      if (key !== this.KEYS.API_KEY && key !== this.KEYS.THEME) {
        localStorage.removeItem(key);
      }
    });
  }

  // API Key management
  getApiKey(): string | null {
    return localStorage.getItem(this.KEYS.API_KEY);
  }

  setApiKey(key: string): void {
    localStorage.setItem(this.KEYS.API_KEY, key);
  }

  // Theme management
  getTheme(): 'light' | 'dark' {
    return (localStorage.getItem(this.KEYS.THEME) as 'light' | 'dark') || 'dark';
  }

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(this.KEYS.THEME, theme);
  }
}

export const storageService = new StorageService();
export type { Reminder, Notification, Topic, ChatSession };