import { storageService } from './storageService';

class TopicService {
  // Extract topics from a message using simple keyword extraction
  extractTopics(message: string): string[] {
    const topics: string[] = [];
    const lowerMessage = message.toLowerCase();

    // Common topic keywords
    const topicPatterns = [
      { pattern: /weather|temperature|rain|sun|cloud|storm/gi, topic: 'Weather' },
      { pattern: /reminder|remind|remember|schedule|appointment/gi, topic: 'Reminders' },
      { pattern: /task|todo|work|project|deadline/gi, topic: 'Task Management' },
      { pattern: /code|programming|javascript|python|development/gi, topic: 'Coding' },
      { pattern: /calendar|event|meeting|date|time/gi, topic: 'Calendar' },
      { pattern: /news|update|current|today|latest/gi, topic: 'News & Updates' },
      { pattern: /help|how to|tutorial|guide|learn/gi, topic: 'Help & Tutorials' },
      { pattern: /music|song|playlist|artist|album/gi, topic: 'Music' },
      { pattern: /movie|film|show|series|watch/gi, topic: 'Entertainment' },
      { pattern: /food|recipe|cook|restaurant|eat/gi, topic: 'Food & Cooking' },
      { pattern: /health|exercise|workout|fitness|diet/gi, topic: 'Health & Fitness' },
      { pattern: /travel|trip|vacation|flight|hotel/gi, topic: 'Travel' },
      { pattern: /money|finance|budget|invest|stock/gi, topic: 'Finance' },
      { pattern: /game|play|gaming|xbox|playstation/gi, topic: 'Gaming' },
      { pattern: /study|learn|education|school|course/gi, topic: 'Education' },
    ];

    topicPatterns.forEach(({ pattern, topic }) => {
      if (pattern.test(message)) {
        topics.push(topic);
      }
    });

    // If no specific topics found, check for general conversation patterns
    if (topics.length === 0) {
      if (/\?/.test(message)) {
        topics.push('Questions');
      } else if (/thanks|thank you|appreciate/gi.test(message)) {
        topics.push('Gratitude');
      } else {
        topics.push('General Chat');
      }
    }

    return [...new Set(topics)]; // Remove duplicates
  }

  // Process a conversation and update topics
  processConversation(messages: { content: string; sender: string }[]) {
    const allTopics: string[] = [];

    messages.forEach((message) => {
      if (message.sender === 'user') {
        const topics = this.extractTopics(message.content);
        allTopics.push(...topics);
      }
    });

    // Update storage with new topics
    allTopics.forEach((topic) => {
      storageService.updateTopic(topic);
    });
  }

  // Get recent topics sorted by frequency
  getRecentTopics(limit: number = 10) {
    return storageService.getTopics().slice(0, limit);
  }

  // Get trending topics (most used in recent time)
  getTrendingTopics() {
    const topics = storageService.getTopics();
    const recentThreshold = new Date();
    recentThreshold.setDate(recentThreshold.getDate() - 7); // Last 7 days

    return topics
      .filter((topic) => new Date(topic.lastUsed) > recentThreshold)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  // Search messages by topic
  searchByTopic(topicName: string, messages: any[]) {
    return messages.filter((message) => {
      const topics = this.extractTopics(message.content);
      return topics.some((t) => t.toLowerCase() === topicName.toLowerCase());
    });
  }
}

export const topicService = new TopicService();