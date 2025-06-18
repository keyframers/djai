import { NextResponse } from 'next/server';
import { searchAlgolia } from '../../actions';

export async function GET(request: Request) {
  // Get the search query from the URL search params
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  const result = await searchAlgolia(query);

  if (result.success && result.results) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
}
