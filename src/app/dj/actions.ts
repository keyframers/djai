'use server';

import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { CoreAssistantMessage, generateObject } from 'ai';
import { CoreUserMessage } from 'ai';

// Song recommendation schema matching the existing Song type
const songRecommendationSchema = z.object({
  title: z.string(),
  artist: z.string(),
  genre: z.string(),
  album: z.string().nullable(),
  year: z.number().nullable(),
  explanation: z.string().describe('Why this song matches the request'),
});

// Discriminated union for response types
const possibleActionsSchema = z.discriminatedUnion('actionType', [
  z.object({
    actionType: z.literal('RECOMMEND_SONGS'),
    message: z.string().describe('The conversational response to the user'),
    prompt: z
      .string()
      .describe(
        'The brief prompt for the song recommendations, e.g. "chill house". summarize what the user asked for.'
      ),
    songs: z
      .array(songRecommendationSchema)
      .min(3)
      .max(5)
      .describe('3-5 song recommendations'),
  }),
  z.object({
    actionType: z.literal('RESPOND_TO_QUERY'),
    message: z
      .string()
      .describe('The brief conversational response to the user'),
  }),
]);

const chatResponseSchema = z.object({
  action: possibleActionsSchema,
});

// Export types for use in components
export type Song = z.infer<typeof songRecommendationSchema>;
export type ChatResponse = z.infer<typeof chatResponseSchema>;

export type ChatMessage = (
  | CoreUserMessage
  | (CoreAssistantMessage & { response: ChatResponse | null })
) & {
  timestamp: number;
};

export interface ChatState {
  messages: ChatMessage[];
}

export async function sendChatMessage(
  prevState: ChatState,
  formData: FormData
): Promise<ChatState> {
  'use server';

  const prompt = formData.get('prompt') as string;

  if (!prompt?.trim()) {
    return prevState;
  }

  const userMessage: ChatMessage = {
    role: 'user',
    content: prompt.trim(),
    timestamp: Date.now(),
  };

  const messages = [...prevState.messages, userMessage];

  try {
    const result = await generateObject({
      model: openai('o3-mini'),
      system: `
You are a knowledgeable and enthusiastic DJ assistant. Your purpose is to help users discover music and learn about music-related topics. 🎵

You can perform two types of actions:

1. RECOMMEND_SONGS:
   - When users ask for song recommendations or describe a mood/situation
   - Examples: "suggest chill songs for coding", "what should I listen to while working out"
   - Focus on understanding the context, mood, activity, or reference point
   - Provide thoughtful recommendations with brief explanations why each song fits
   - Consider factors like tempo, energy, genre, and mood
   - Always include 3-5 song recommendations
   - Use emojis and casual language to make responses engaging 🎧

2. RESPOND_TO_QUERY:
   - When users ask music-related questions or seek information
   - Examples: "what genre is trip-hop", "who influenced The Beatles"
   - Provide clear, informative answers while maintaining conversation flow
   - Keep responses focused on music-related topics
   - Use your knowledge to educate and engage
   - No song recommendations needed for these responses

Your personality:
- Enthusiastic and passionate about music 🎸
- Conversational but knowledgeable
- Uses emojis naturally (but don't overdo it)
- Speaks like a real DJ who loves sharing music

Remember:
- Always determine the appropriate action type first
- For recommendations, explain why each song fits
- Keep responses focused and relevant to music
- Be engaging and conversational
- Use the exact schema format for responses
`.trim(),
      messages,
      schema: chatResponseSchema,
    });

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: result.object.action.message,
      response: result.object,
      timestamp: Date.now(),
    };

    return {
      messages: [...messages, assistantMessage],
    };
  } catch (error) {
    console.error('Error in sendChatMessage:', error);

    const errorMessage: ChatMessage = {
      role: 'assistant',
      content:
        'Sorry, I had trouble processing your request. Please try again.',
      timestamp: Date.now(),
      response: null,
    };

    return {
      messages: [...prevState.messages, userMessage, errorMessage],
    };
  }
}
