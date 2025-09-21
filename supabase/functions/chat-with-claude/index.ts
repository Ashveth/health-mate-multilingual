import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const claudeApiKey = Deno.env.get('CLAUDE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Medical knowledge graph data for health recommendations
const medicalKnowledgeGraph = {
  diseases: {
    fever: {
      symptoms: ['high temperature', 'headache', 'body aches', 'fatigue'],
      precautions: ['Rest', 'Stay hydrated', 'Take paracetamol', 'Monitor temperature'],
      when_to_see_doctor: 'If fever exceeds 103°F or persists for more than 3 days'
    },
    dengue: {
      symptoms: ['high fever', 'severe headache', 'eye pain', 'muscle pain', 'rash'],
      precautions: ['Use mosquito nets', 'Eliminate stagnant water', 'Wear full sleeves', 'Use repellent'],
      when_to_see_doctor: 'Immediately if you suspect dengue - can be life threatening'
    },
    covid19: {
      symptoms: ['fever', 'cough', 'difficulty breathing', 'loss of taste/smell'],
      precautions: ['Wear masks', 'Maintain social distance', 'Sanitize hands', 'Get vaccinated'],
      when_to_see_doctor: 'If breathing difficulty or oxygen levels drop'
    }
  },
  emergency_numbers: {
    india: {
      ambulance: '108',
      police: '100',
      fire: '101',
      women_helpline: '1091'
    }
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], userLanguage = 'en' } = await req.json();

    // Input validation for security
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message format');
    }
    
    if (message.length > 1000) {
      throw new Error('Message too long. Please keep messages under 1000 characters.');
    }
    
    if (typeof userLanguage !== 'string' || !['en', 'hi', 'es', 'fr', 'ta', 'te', 'kn', 'bn', 'mr', 'gu', 'ml', 'pa'].includes(userLanguage)) {
      throw new Error('Invalid language selection');
    }
    
    if (!Array.isArray(conversationHistory)) {
      throw new Error('Invalid conversation history format');
    }

    // Sanitize message input
    const sanitizedMessage = message.trim().replace(/[<>]/g, '');

    // Build context-aware system prompt with medical knowledge
    const systemPrompt = `You are AI HealthMate, a multilingual AI health assistant. 
    
Key Guidelines:
- Respond in ${userLanguage === 'en' ? 'English' : 'the user\'s preferred language'}
- Provide accurate, personalized health information based on medical knowledge
- Always recommend consulting a doctor for serious symptoms
- Include relevant precautions and preventive measures
- Be empathetic and supportive
- Use the medical knowledge graph data when relevant
- Keep responses concise but informative
- Focus on preventive care and wellness

Medical Knowledge Available:
${JSON.stringify(medicalKnowledgeGraph, null, 2)}

CRITICAL: Always end serious health concerns with "Please consult a qualified doctor for proper diagnosis and treatment."

Current conversation language: ${userLanguage}`;

    // Build conversation history for context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.type === 'ai' ? 'assistant' : 'user',
        content: msg.content
      })),
      { role: 'user', content: sanitizedMessage }
    ];

    console.log('Sending request to OpenRouter API with', messages.length, 'messages');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${claudeApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-health-app.com',
        'X-Title': 'AI HealthMate'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        max_tokens: 1024,
        messages: messages
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API response received successfully');
    
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-with-claude function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to get AI response. Please try again.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});