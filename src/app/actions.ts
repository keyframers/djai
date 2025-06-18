'use server';

import { algoliasearch } from 'algoliasearch';

const appID = process.env.ALGOLIA_APPLICATION_ID!;
const apiKey = process.env.ALGOLIA_API_KEY!;
const indexName = process.env.ALGOLIA_INDEX_NAME!;

export async function searchAlgolia(query: string): Promise<{
  success: boolean;
  results: Array<{
    artist: string;
    song: string;
    text: string;
  }>;
}> {
  const client = algoliasearch(appID, apiKey);

  try {
    const { results } = await client.search({
      requests: [
        {
          indexName,
          query,
        },
      ],
    });

    return { success: true, results: results[0]?.hits };
  } catch (error) {
    console.error('Algolia search error:', error);
    return { success: false, error: 'Failed to perform search' };
  }
}
