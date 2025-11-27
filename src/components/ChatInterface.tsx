import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Volume2, VolumeX, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  language?: string;
  verified?: boolean;
  sources?: string[];
}

export const ChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [autoRead, setAutoRead] = useState(false);

  // Load voice preferences from profile
  useEffect(() => {
    const loadVoicePreferences = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('voice_output_enabled, auto_read_responses, speech_rate')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setVoiceEnabled(data.voice_output_enabled || false);
        setAutoRead(data.auto_read_responses || false);
      }
    };
    
    loadVoicePreferences();
  }, [user]);

  // Speech recognition hook
  const {
    transcript,
    isListening,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: 'en-US',
    continuous: false,
    interimResults: true,
  });

  // Text-to-speech hook
  const {
    speak,
    stop: stopSpeaking,
    isSpeaking,
    isSupported: isTTSSupported,
  } = useTextToSpeech({
    language: 'en-US',
    rate: 1,
  });

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputMessage(transcript);
    }
  }, [transcript]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Client-side input validation
    if (inputMessage.length > 1000) {
      toast({
        title: "Message too long",
        description: "Please keep your message under 1000 characters.",
        variant: "destructive",
      });
      return;
    }

    // Stop any ongoing speech
    stopSpeaking();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    resetTranscript();
    setIsLoading(true);

    try {
      // Handle specific chatbot workflows
      const response = await handleChatbotWorkflow(inputMessage);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
        verified: false,
        sources: []
      };
      setMessages(prev => [...prev, aiResponse]);

      // Auto-read AI response if enabled
      if (voiceEnabled && autoRead && isTTSSupported) {
        // Remove markdown formatting for speech
        const textToSpeak = response
          .replace(/[#*`]/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/\n+/g, '. ');
        speak(textToSpeak);
      }
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

      // Store verification info for the response
      if (data.verified) {
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === (Date.now() + 1).toString() 
              ? { ...msg, verified: true, sources: data.sources || [] }
              : msg
          ));
        }, 100);
      }

      return data.response || 'I apologize, but I encountered an issue processing your request. Please try again.';
    } catch (error) {
      return 'Sorry, I couldn\'t process your health question right now. Please try again later or contact support.';
    }
  };

  const toggleListening = () => {
    if (!isSpeechSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleVoiceOutput = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-gradient-bg">
      {/* Verification Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b border-primary/20 px-4 py-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-white/50 dark:bg-black/30 rounded-full backdrop-blur-sm border border-primary/20">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium text-primary">
              Information verified by WHO
            </span>
          </div>
        </div>
      </div>

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
                {message.type === 'ai' && message.verified && (
                  <div className="mb-3 flex items-center gap-2 text-xs px-2 py-1 bg-primary/10 rounded-md border border-primary/20">
                    <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-primary">Verified by WHO</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed">
                  {message.type === 'ai' ? (
                    <div className="markdown-content">
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-2">{children}</p>,
                          ul: ({children}) => <ul className="space-y-1 mb-2">{children}</ul>,
                          li: ({children}) => <li className="flex items-start"><span className="text-primary mr-2 mt-1">•</span><span className="flex-1">{children}</span></li>,
                          strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                          h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({children}) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({children}) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
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
            onClick={toggleVoiceOutput}
            className={`flex-shrink-0 transition-all duration-200 ${
              voiceEnabled ? 'bg-accent text-accent-foreground shadow-medical' : 'hover:bg-accent-light/10'
            }`}
            title={voiceEnabled ? "Voice output enabled" : "Voice output disabled"}
          >
            {voiceEnabled ? (
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};