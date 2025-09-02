import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, TrendingUp, MessageSquare, HelpCircle, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { topicService } from '../../services/topicService';
import { weatherService } from '../../services/weatherService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface SuggestionsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuggestionClick?: (suggestion: string) => void;
}

interface Suggestion {
  id: string;
  text: string;
  category: string;
  icon: React.ReactNode;
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  open,
  onOpenChange,
  onSuggestionClick,
}) => {
  const { messages, preferences } = useApp();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      generateSuggestions();
      loadTrendingTopics();
    }
  }, [open, messages]);

  const loadTrendingTopics = () => {
    const trending = topicService.getTrendingTopics();
    setTrendingTopics(trending.map(t => t.name));
  };

  const generateSuggestions = async () => {
    const newSuggestions: Suggestion[] = [];

    // Context-based suggestions
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const topics = topicService.extractTopics(lastMessage.content);

      if (topics.includes('Weather')) {
        newSuggestions.push({
          id: 'weather-1',
          text: 'What should I wear today based on the weather?',
          category: 'Weather',
          icon: <MessageSquare className="h-4 w-4" />,
        });
        newSuggestions.push({
          id: 'weather-2',
          text: 'Will it rain this week?',
          category: 'Weather',
          icon: <MessageSquare className="h-4 w-4" />,
        });
      }

      if (topics.includes('Task Management')) {
        newSuggestions.push({
          id: 'task-1',
          text: 'Help me prioritize my tasks for today',
          category: 'Productivity',
          icon: <TrendingUp className="h-4 w-4" />,
        });
        newSuggestions.push({
          id: 'task-2',
          text: 'Create a daily schedule template',
          category: 'Productivity',
          icon: <TrendingUp className="h-4 w-4" />,
        });
      }
    }

    // Time-based suggestions
    const hour = new Date().getHours();
    if (hour < 12) {
      newSuggestions.push({
        id: 'morning-1',
        text: "What's a good morning routine?",
        category: 'Lifestyle',
        icon: <Lightbulb className="h-4 w-4" />,
      });
      newSuggestions.push({
        id: 'morning-2',
        text: 'Suggest a healthy breakfast recipe',
        category: 'Food',
        icon: <Lightbulb className="h-4 w-4" />,
      });
    } else if (hour < 17) {
      newSuggestions.push({
        id: 'afternoon-1',
        text: 'How can I stay productive in the afternoon?',
        category: 'Productivity',
        icon: <TrendingUp className="h-4 w-4" />,
      });
    } else {
      newSuggestions.push({
        id: 'evening-1',
        text: 'Suggest some relaxing evening activities',
        category: 'Lifestyle',
        icon: <Lightbulb className="h-4 w-4" />,
      });
    }

    // General helpful suggestions
    newSuggestions.push({
      id: 'general-1',
      text: 'Tell me an interesting fact',
      category: 'General',
      icon: <HelpCircle className="h-4 w-4" />,
    });
    newSuggestions.push({
      id: 'general-2',
      text: 'Help me learn something new today',
      category: 'Education',
      icon: <HelpCircle className="h-4 w-4" />,
    });
    newSuggestions.push({
      id: 'general-3',
      text: 'Suggest a creative project I can start',
      category: 'Creativity',
      icon: <Lightbulb className="h-4 w-4" />,
    });

    setSuggestions(newSuggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestionClick?.(suggestion);
    onOpenChange(false);
  };

  const categoryColors: Record<string, string> = {
    Weather: 'bg-blue-500',
    Productivity: 'bg-green-500',
    Lifestyle: 'bg-purple-500',
    Food: 'bg-orange-500',
    General: 'bg-gray-500',
    Education: 'bg-indigo-500',
    Creativity: 'bg-pink-500',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Suggestions
          </DialogTitle>
          <DialogDescription>
            Personalized suggestions based on your conversations and interests
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {trendingTopics.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                Your Recent Interests
              </h4>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <Badge key={topic} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              <AnimatePresence>
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className="p-3 cursor-pointer hover:bg-muted/50 transition-colors group"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{suggestion.icon}</div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {suggestion.text}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                'mt-1 text-xs',
                                categoryColors[suggestion.category]
                              )}
                              style={{ 
                                backgroundColor: `${categoryColors[suggestion.category]}20`,
                                borderColor: categoryColors[suggestion.category],
                              }}
                            >
                              {suggestion.category}
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {suggestions.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No suggestions available</p>
                  <p className="text-xs mt-1">Start a conversation to get personalized suggestions</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Tip: Suggestions are based on your conversation history, time of day, and interests.
              The more you chat, the better the suggestions become!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestionsPanel;