import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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

MARKDOWN FORMATTING REQUIREMENTS (CRITICAL):
- Use **bold** for emphasis: **text**
- Use bullet points with proper markdown: - item or * item
- Use proper headings: ## Heading or ### Subheading
- NEVER use plain text bullets like "•" - use markdown list syntax instead
- Format all sections with clear markdown structure

RESPONSE STRUCTURE FOR HEALTH QUERIES:
Start with medicine recommendations using proper markdown:

## 🏥 RECOMMENDED MEDICINES (Over-the-counter)
- **Medicine Name** - dosage and purpose
- **Medicine Name** - dosage and purpose

Then provide other information:

## 🔍 SYMPTOMS TO WATCH
- Symptom 1
- Symptom 2

## ⚠️ PRECAUTIONS
- Precaution 1
- Precaution 2

## 🏠 HOME REMEDIES
- Remedy 1
- Remedy 2

Key Guidelines:
- Respond in ${userLanguage === 'en' ? 'English' : 'the user\'s preferred language'}
- Use proper markdown formatting for all responses
- Bold important terms using **double asterisks**
- Use markdown lists (- or *) not plain bullets
- Use ## for main sections, ### for subsections
- Provide accurate, personalized health information
- Always recommend consulting a doctor for serious symptoms
- Be empathetic and supportive
- Keep responses concise but informative

Medical Knowledge Available:
${JSON.stringify(medicalKnowledgeGraph, null, 2)}

CRITICAL: Always end serious health concerns with:
⚠️ **Please consult a qualified doctor for proper diagnosis and treatment.**

Current conversation language: ${userLanguage}`;

    // Build conversation history for OpenAI format
    const messages = [
      { role: 'system', content: systemPrompt }
    ];
    
    // Add conversation history
    conversationHistory.slice(-10).forEach((msg: any) => {
      messages.push({
        role: msg.type === 'ai' ? 'assistant' : 'user',
        content: msg.content
      });
    });
    
    // Add current user message
    messages.push({
      role: 'user',
      content: sanitizedMessage
    });

    console.log('Sending request to Lovable AI Gateway with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      if (response.status === 402) {
        throw new Error('AI credits depleted. Please add credits to continue using AI features.');
      }
      
      throw new Error(`Lovable AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Lovable AI Gateway response received successfully');
    
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