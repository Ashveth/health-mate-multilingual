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
      content: 'Hello! I\'m AI HealthMate, your personal health assistant. How can I help you today? (मैं आपकी कैसे सहायता कर सकता हूं?)',
      timestamp: new Date(),
      language: 'en-hi'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response (will be replaced with actual Claude API)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand your concern. Let me help you with that health query. Based on medical knowledge, I recommend...',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
                <p className="text-sm leading-relaxed">{message.content}</p>
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