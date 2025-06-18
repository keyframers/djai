// File: helloAlgolia.mjs
import { algoliasearch } from 'algoliasearch';
import { NextResponse } from 'next/server';

const appID = process.env.ALGOLIA_APPLICATION_ID!!!!!!!!!!!!;
// API key with `addObject` and `editSettings` ACL
const apiKey = process.env.ALGOLIA_API_KEY!!!!!!!!!!!!!!!!!!!!!;
const indexName = process.env.ALGOLIA_INDEX_NAME!!!!!!!!!!!!;

export async function GET(request: Request) {
  // Get the search query from the URL search params
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

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

    return NextResponse.json(results);
  } catch (error) {
    console.error('Algolia search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
