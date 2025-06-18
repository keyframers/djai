'use client';

import { useState, useTransition } from 'react';
import { generate } from './actions';
import { readStreamableValue } from 'ai/rsc';
import { createStore } from '@xstate/store';
import { useSelector } from '@xstate/store/react';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

function SuggestionsCards({ suggestions }: { suggestions: any[] }) {
  if (!suggestions?.length) return null;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginTop: 24,
      }}
    >
      {suggestions.map((s, i) => (
        <div
          key={s.title + s.artist + i}
          style={{
            background: '#fff',
            color: '#111',
            borderRadius: 10,
            boxShadow: '0 2px 8px #0001',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            borderLeft: '6px solid #6e56cf',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 18 }}>{s.title}</div>
          <div style={{ color: '#6e56cf', fontWeight: 500 }}>{s.artist}</div>
          <div style={{ fontSize: 14, color: '#555' }}>Genre: {s.genre}</div>
          <div style={{ fontSize: 13, color: '#888' }}>
            Vibe: {s.similarity}
          </div>
        </div>
      ))}
    </div>
  );
}

const suggestionStore = createStore({
  context: {
    prompt: 'Chill acoustic songs for coding',
    suggestions: [] as any[],
  },
  on: {
    promptChanged: (context, event: { prompt: string }) => ({
      ...context,
      prompt: event.prompt,
    }),
    suggestionsChanged: (context, event: { suggestions: any[] }) => ({
      ...context,
      suggestions: event.suggestions,
    }),
    suggestionsCleared: (context) => ({
      ...context,
      suggestions: [],
    }),
  },
});

export default function Home() {
  const prompt = useSelector(suggestionStore, (state) => state.context.prompt);
  const suggestions = useSelector(
    suggestionStore,
    (state) => state.context.suggestions
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div
      style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}
    >
      <h2>DJai Song Suggestions</h2>
      <textarea
        defaultValue={prompt}
        onBlur={(e) =>
          suggestionStore.trigger.promptChanged({
            prompt: e.target.value.trim(),
          })
        }
        rows={3}
        style={{ width: '100%', padding: 8, fontSize: 16, marginBottom: 12 }}
        placeholder="Describe the vibe, genre, or activity (e.g. 'chill electro music for coding')"
        disabled={isPending}
      />
      <br />
      <button
        onClick={() => {
          suggestionStore.trigger.suggestionsCleared();

          startTransition(async () => {
            const { object } = await generate(prompt);
            for await (const partialObject of readStreamableValue(object)) {
              if (partialObject && partialObject.suggestions) {
                suggestionStore.trigger.suggestionsChanged({
                  suggestions: partialObject.suggestions,
                });
              }
            }
          });
        }}
        disabled={isPending || !prompt.trim()}
        style={{ padding: '8px 20px', fontSize: 16 }}
      >
        {isPending ? 'Finding songs...' : 'Ask'}
      </button>
      {isPending && !suggestions.length ? (
        <div style={{ marginTop: 32, color: '#888', textAlign: 'center' }}>
          Loading suggestions...
        </div>
      ) : null}
      {!isPending && !suggestions.length ? (
        <div style={{ marginTop: 32, color: '#bbb', textAlign: 'center' }}>
          Suggestions will appear here.
        </div>
      ) : null}
      <SuggestionsCards suggestions={suggestions} />
    </div>
  );
}
