'use client';

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import {
  sendChatMessage,
  type Song,
  type ChatResponse,
  type ChatState,
  type ChatMessage,
} from '../actions';

const initialState: ChatState = {
  messages: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? '...' : 'Send'}
    </button>
  );
}

export default function ChatView() {
  const [state, formAction] = useActionState(sendChatMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  console.log(state);

  const SongCard = ({ song }: { song: Song }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-750 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <h4 className="font-semibold text-white">{song.title}</h4>
        <p className="text-gray-300">{song.artist}</p>
      </div>

      {(song.album || song.year || song.genre) && (
        <div className="flex flex-wrap gap-2 mb-2">
          {song.album && (
            <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
              {song.album}
            </span>
          )}
          {song.year && (
            <span className="px-2 py-1 bg-green-900 text-green-200 text-xs rounded-full">
              {song.year}
            </span>
          )}
          {song.genre && (
            <span className="px-2 py-1 bg-yellow-900 text-yellow-200 text-xs rounded-full">
              {song.genre}
            </span>
          )}
        </div>
      )}

      <p className="text-sm text-gray-300 italic">{song.explanation}</p>
    </div>
  );

  const MessageBubble = ({ message }: { message: ChatMessage }) => (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content as string}</p>

        {message.role === 'assistant' &&
          message.response &&
          message.response.action.actionType === 'RECOMMEND_SONGS' && (
            <div className="mt-4 space-y-3">
              {message.response.action.songs.map((song, index) => (
                <SongCard key={index} song={song} />
              ))}
            </div>
          )}

        <div className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto ">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.length === 0 ? (
          <div>placeholder...</div>
        ) : (
          state.messages.map((message: ChatMessage, i) => (
            <MessageBubble key={i} message={message} />
          ))
        )}

        {pending && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                <span>DJ is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t p-4">
        <form
          ref={formRef}
          action={formAction}
          className="flex gap-2"
          onSubmit={() => {
            // Reset form after submission
            setTimeout(() => formRef.current?.reset(), 0);
          }}
        >
          <input
            type="text"
            name="prompt"
            placeholder="Ask for music recommendations or music questions..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={pending}
            required
          />
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
