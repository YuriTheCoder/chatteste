import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { Message } from '../../types/index';
import { cn } from '../../lib/utils';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex gap-3 group",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border shadow-sm",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      
      <div className={cn(
        "flex flex-col gap-1 max-w-[70%]",
        isUser && "items-end"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-2.5 shadow-sm",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-muted rounded-tl-sm"
        )}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        
        <span className={cn(
          "text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity px-1",
          isUser && "text-right"
        )}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;