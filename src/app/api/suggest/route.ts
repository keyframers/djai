import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const songSchema = z.object({
  title: z.string(),
  artist: z.string(),
  genre: z.string(),
  similarity: z.string().describe('The similarity of the song to the prompt'),
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await generateObject({
    model: openai('o4-mini'),
    system: `
 You are a DJ assistant.
 You are given a prompt and you need to suggest a song that matches the prompt.
 You need to suggest a song that is similar to the prompt.
 You need to suggest a song that is in the same genre as the prompt.
 You need to suggest a song that is in the same mood as the prompt.
    `.trim(),
    prompt,
    schema: z.object({
      suggestions: z.array(songSchema),
    }),
  });

  return result.toJsonResponse();
}
