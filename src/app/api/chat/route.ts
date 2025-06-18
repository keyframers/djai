import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Song recommendation schema matching the existing Song type
const songRecommendationSchema = z.object({
  title: z.string(),
  artist: z.string(),
  genre: z.string().optional(),
  album: z.string().optional(),
  year: z.number().optional(),
  explanation: z.string().describe('Why this song matches the request'),
});

// Discriminated union for response types
const possibleActionsSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('RECOMMEND_SONGS'),
    message: z.string().describe('The conversational response to the user'),
    songs: z
      .array(songRecommendationSchema)
      .min(3)
      .max(5)
      .describe('3-5 song recommendations'),
  }),
  z.object({
    action: z.literal('RESPOND_TO_QUERY'),
    message: z.string().describe('The conversational response to the user'),
  }),
]);

const responseSchema = z.object({
  action: possibleActionsSchema,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await generateObject({
    model: openai('o4-mini'),
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
    prompt,
    schema: responseSchema,
  });

  return NextResponse.json(result.object);
}
