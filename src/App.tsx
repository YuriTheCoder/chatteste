import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ChatWindow from './components/ChatWindow/ChatWindow';
import WeatherWidget from './components/WeatherWidget/WeatherWidget';
import Onboarding from './components/Onboarding/Onboarding';
import SettingsModal from './components/Settings/SettingsModal';
import NotificationCenter from './components/Notifications/NotificationCenter';
import ReminderModal from './components/Reminders/ReminderModal';
import SuggestionsPanel from './components/Suggestions/SuggestionsPanel';
import { Moon, Sun, Menu, X, Sparkles, Calendar, Bell, Settings, TrendingUp, MessageSquare, Clock } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { cn } from './lib/utils';
import { storageService } from './services/storageService';
import type { Topic } from './services/storageService';
import { topicService } from './services/topicService';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [recentTopics, setRecentTopics] = useState<Topic[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (!savedKey) {
      setShowOnboarding(true);
    } else {
      setApiKey(savedKey);
    }
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.className = savedTheme;
    }

    // Load recent topics
    loadRecentTopics();
  }, []);

  const loadRecentTopics = () => {
    const topics = topicService.getRecentTopics(5);
    setRecentTopics(topics);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  const handleOnboardingComplete = (geminiKey: string) => {
    if (geminiKey) {
      localStorage.setItem('gemini_api_key', geminiKey);
      setApiKey(geminiKey);
      (window as any).GEMINI_API_KEY = geminiKey;
    }
    setShowOnboarding(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion);
    // This will be passed to ChatWindow via context or props
  };

  const handleTopicClick = (topic: Topic) => {
    // Filter messages by topic or perform other actions
    console.log('Topic clicked:', topic.name);
  };

  const quickActions = [
    {
      id: 'reminder',
      icon: Bell,
      label: 'Set Reminder',
      onClick: () => setShowReminders(true),
    },
    {
      id: 'calendar',
      icon: Calendar,
      label: 'View Calendar',
      onClick: () => console.log('Calendar clicked'),
    },
    {
      id: 'suggestions',
      icon: Sparkles,
      label: 'Suggestions',
      onClick: () => setShowSuggestions(true),
    },
  ];

  return (
    <NotificationProvider>
      <AppProvider>
        <Router>
          <AnimatePresence>
            {showOnboarding && (
              <Onboarding onComplete={handleOnboardingComplete} />
            )}
          </AnimatePresence>
          
          {/* Modals */}
          <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
          <ReminderModal open={showReminders} onOpenChange={setShowReminders} />
          <SuggestionsPanel 
            open={showSuggestions} 
            onOpenChange={setShowSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
          
          <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 max-w-screen-2xl items-center px-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-start">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-lg">Companion AI</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-auto">
                    <NotificationCenter />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex h-[calc(100vh-3.5rem)]">
              <motion.aside
                initial={false}
                animate={{
                  width: showSidebar ? 320 : 0,
                  opacity: showSidebar ? 1 : 0
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className={cn(
                  "border-r bg-muted/10 overflow-hidden",
                  !showSidebar && "hidden md:block"
                )}
              >
                <div className="h-full overflow-y-auto p-4 space-y-4">
                  <WeatherWidget />
                  
                  <Card className="p-4">
                    <h3 className="font-medium text-sm text-muted-foreground mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <Button
                            key={action.id}
                            variant="outline"
                            className="w-full justify-start"
                            size="sm"
                            onClick={action.onClick}
                          >
                            <Icon className="mr-2 h-4 w-4" />
                            {action.label}
                          </Button>
                        );
                      })}
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-sm text-muted-foreground">Recent Topics</h3>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      {recentTopics.length > 0 ? (
                        recentTopics.map((topic) => (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors group"
                            onClick={() => handleTopicClick(topic)}
                          >
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{topic.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {topic.count}
                              </Badge>
                              <Clock className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          <MessageSquare className="h-6 w-6 mx-auto mb-2 opacity-50" />
                          <p>No recent topics</p>
                          <p className="text-xs mt-1">Start chatting to see topics</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </motion.aside>

              <main className="flex-1 overflow-hidden">
                <Routes>
                  <Route path="/" element={
                    <ChatWindow 
                      onMessagesUpdate={loadRecentTopics}
                      initialInput={currentInput}
                    />
                  } />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AppProvider>
    </NotificationProvider>
  );
}

export default App;