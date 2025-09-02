import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment or localStorage
const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || 
         localStorage.getItem('gemini_api_key') || 
         (window as any).GEMINI_API_KEY || 
         '';
};

const genAI = new GoogleGenerativeAI(getApiKey());

export const geminiService = {
  async sendMessage(message: string, context?: string): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      
      const prompt = context 
        ? `Context: ${context}\n\nUser: ${message}\n\nAssistant:`
        : `User: ${message}\n\nAssistant:`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  },

  async generateContextualResponse(
    message: string,
    userPreferences: any,
    conversationHistory: any[]
  ): Promise<string> {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
      
      const context = `
        User preferences: ${JSON.stringify(userPreferences)}
        Recent conversation: ${conversationHistory.slice(-5).map(m => `${m.sender}: ${m.content}`).join('\n')}
      `;
      
      const prompt = `
        You are a helpful personal assistant. Consider the user's preferences and conversation history.
        ${context}
        
        User: ${message}
        
        Provide a helpful, personalized response:
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I encountered an error. Please try again.';
    }
  }
};