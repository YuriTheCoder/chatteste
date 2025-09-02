import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserPreferences, Message } from '../types/index';

interface AppContextType {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    name: '',
    location: '',
    interests: [],
  });
  
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <AppContext.Provider value={{
      preferences,
      setPreferences,
      messages,
      addMessage,
      clearMessages,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};