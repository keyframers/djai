'use server';

import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';

const songSchema = z.object({
  title: z.string(),
  artist: z.string(),
  genre: z.string(),
  similarity: z
    .string()
    .describe(
      'A brief description of the similarity of the song to the prompt, no more than 6 words; e.g. "Chill, calm, acoustic"'
    ),
});

export async function generate(input: string) {
  'use server';

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = streamObject({
      model: openai('o3-mini'),
      system: `
You are DJai, an expert AI DJ and music curator. Your job is to recommend the 10 best songs that perfectly match the user's request, considering their mood, genre, activity, or any specific details they provide. For each song, provide:
- Title
- Artist
- Genre
- A brief explanation of why this song fits the user's prompt

Your recommendations should be diverse, relevant, and tailored to the user's description. If the user's prompt is broad, include a variety of styles within their request. If it's specific, focus closely on their criteria. Be creative, insightful, and always aim to delight the listener with your selections.`.trim(),
      prompt: input,
      schema: z.object({
        suggestions: z.array(songSchema),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}
