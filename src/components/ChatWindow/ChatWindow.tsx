import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { geminiService } from '../../services/geminiService';
import { topicService } from '../../services/topicService';
import MessageBubble from '../MessageBubble/MessageBubble';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';

interface ChatWindowProps {
  onMessagesUpdate?: () => void;
  initialInput?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ onMessagesUpdate, initialInput }) => {
  const { messages, addMessage, preferences } = useApp();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    onMessagesUpdate?.();
  }, [messages]);

  useEffect(() => {
    if (initialInput) {
      setInput(initialInput);
    }
  }, [initialInput]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);

    // Process topics from the conversation
    topicService.processConversation([userMessage]);

    try {
      const response = await geminiService.generateContextualResponse(
        input,
        preferences,
        messages
      );

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'assistant' as const,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b px-6 py-3 flex items-center justify-between bg-muted/5">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="absolute -bottom-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
              >
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Welcome to Companion AI</h3>
                <p className="text-muted-foreground max-w-md">
                  I'm here to assist you with anything you need. Just type a message to get started!
                </p>
              </motion.div>
            ) : (
              messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))
            )}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 px-4 py-3"
            >
              <div className="flex space-x-1">
                <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 bg-primary rounded-full animate-bounce" />
              </div>
              <span className="text-sm text-muted-foreground">AI is thinking...</span>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4 bg-muted/5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="min-h-[44px] max-h-[120px] resize-none pr-24"
                rows={1}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isLoading}
                  size="icon"
                  className="h-8 w-8"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted-foreground">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;