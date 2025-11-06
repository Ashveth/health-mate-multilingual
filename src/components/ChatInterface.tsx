import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Volume2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m AI HealthMate, your Public Health Assistant. 🏥\n\nI can help you with:\n• 📅 **Book appointments** - "Book appointment with cardiologist"\n• 🔍 **Find doctors** - "Find pediatrician near me"\n• 🚨 **Emergency help** - "Emergency" or "Ambulance"\n• 💬 **Health questions** - Ask about symptoms, treatments, wellness\n\nHow can I assist you today? (मैं आपकी कैसे सहायता कर सकता हूं?)',
      timestamp: new Date(),
      language: 'en-hi'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatAIResponse = (content: string) => {
    // Split content by sentences and format into bullet points
    const lines = content.split(/(?:[.!?]\s+)|(?:\n)/);
    const formattedLines: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Check if line already has formatting (emojis, bullets, etc.)
      if (trimmedLine.includes('•') || trimmedLine.includes('**') || /^[🏥🔍⚠️🏠💊]/.test(trimmedLine)) {
        formattedLines.push(
          <div key={index} className="mb-1">
            {trimmedLine}
          </div>
        );
      } else {
        // Convert regular sentences to bullet points
        if (trimmedLine.length > 20) { // Only format longer sentences
          formattedLines.push(
            <div key={index} className="mb-1 flex items-start">
              <span className="text-primary mr-2 mt-1 text-xs">•</span>
              <span>{trimmedLine.endsWith('.') ? trimmedLine : trimmedLine + '.'}</span>
            </div>
          );
        } else if (trimmedLine.length > 0) {
          formattedLines.push(
            <div key={index} className="mb-1 font-semibold">
              {trimmedLine}
            </div>
          );
        }
      }
    });
    
    return formattedLines.length > 0 ? formattedLines : [<p key="default">{content}</p>];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Client-side input validation
    if (inputMessage.length > 1000) {
      const { toast } = await import('@/hooks/use-toast');
      toast({
        title: "Message too long",
        description: "Please keep your message under 1000 characters.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Handle specific chatbot workflows
      const response = await handleChatbotWorkflow(inputMessage);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I\'m having trouble connecting right now. Please check your connection and try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatbotWorkflow = async (message: string): Promise<string> => {
    const lowerMessage = message.toLowerCase();
    
    // Doctor Appointment Booking Workflow
    if (lowerMessage.includes('book') && (lowerMessage.includes('appointment') || lowerMessage.includes('doctor'))) {
      return "I'll help you book an appointment! Please tell me:\n\n1️⃣ **Doctor's name** or **specialization** (e.g., 'cardiologist', 'Dr. Smith')\n\nYou can also visit the 'Find Doctors' section to browse available doctors and book directly.";
    }
    
    // Find Doctor Workflow
    if (lowerMessage.includes('find doctor') || lowerMessage.includes('search doctor')) {
      return "I can help you find doctors! Please specify:\n\n🔍 **Search by:**\n- Specialization (e.g., cardiologist, pediatrician)\n- Doctor's name\n- Location (city or area)\n\nExample: 'Find cardiologist in Mumbai' or 'Dr. Smith'\n\nYou can also use the 'Find Doctors' page for a complete search experience.";
    }
    
    // Emergency Workflow
    if (lowerMessage.includes('emergency') || lowerMessage.includes('ambulance') || lowerMessage.includes('urgent')) {
      return "🚨 **EMERGENCY SERVICES**\n\n📞 **Ambulance**: 108\n📞 **Police**: 100\n📞 **Fire**: 101\n\nFor non-emergency help, you can:\n- Add emergency contacts in the Emergency section\n- Save your personal doctor's number\n- Add family members' contact information\n\n*If this is a medical emergency, please call 108 immediately.*";
    }
    
    // Default to Claude API for general health questions
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase.functions.invoke('chat-with-claude', {
        body: { 
          message: message,
          conversationHistory: messages.slice(-10) // Include recent context
        }
      });

      if (error) throw error;

      return data.response || 'I apologize, but I encountered an issue processing your request. Please try again.';
    } catch (error) {
      return 'Sorry, I couldn\'t process your health question right now. Please try again later or contact support.';
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Speech-to-text functionality will be implemented here
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-gradient-bg">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-medical">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              
              <Card className={`max-w-[80%] p-4 shadow-card ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-card border border-primary-light/20'
              }`}>
                <div className="text-sm leading-relaxed">
                  {message.type === 'ai' ? (
                    <div className="space-y-2">
                      {formatAIResponse(message.content)}
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.language && (
                    <Badge variant="secondary" className="text-xs">
                      Multilingual
                    </Badge>
                  )}
                </div>
              </Card>

              {message.type === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shadow-medical">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <Card className="p-4 shadow-card bg-card border border-primary-light/20">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleListening}
            className={`flex-shrink-0 transition-all duration-200 ${
              isListening ? 'bg-primary text-primary-foreground shadow-medical' : 'hover:bg-primary-light/10'
            }`}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about symptoms, treatments, or health advice..."
              className="pr-12 bg-background border-primary-light/20 focus:border-primary transition-colors"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="absolute right-1 top-1 bg-gradient-primary hover:shadow-medical transition-all"
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="flex-shrink-0 hover:bg-accent-light/10 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};