'use client';

import { useActionState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import {
  sendChatMessage,
  type Song,
  type ChatResponse,
  type ChatState,
  type Message,
} from '../actions';

const initialState: ChatState = {
  messages: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? '...' : 'Send'}
    </button>
  );
}

export default function ChatView() {
  const [state, formAction] = useActionState(sendChatMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  const SongCard = ({ song }: { song: Song }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-3 hover:bg-gray-750 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">🎵</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white">{song.title}</h4>
          <p className="text-gray-300">{song.artist}</p>
        </div>
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

  const MessageBubble = ({ message }: { message: Message }) => (
    <div
      className={`flex ${
        message.type === 'user' ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.type === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.response?.action.actionType === 'RECOMMEND_SONGS' && (
          <div className="mt-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span>🎧</span>
              Song Recommendations
            </h3>
            {message.response.action.songs.map((song, index) => (
              <SongCard key={index} song={song} />
            ))}
          </div>
        )}

        <div className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto ">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span>🎧</span>
          DJ Chat
        </h1>
        <p className="text-purple-100 text-sm">
          Ask for music recommendations or music questions!
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-xl font-semibold mb-2">Welcome to DJ Chat!</h2>
            <p className="text-gray-400">
              Ask me for music recommendations or any music-related questions
            </p>
            <div className="mt-4 text-sm text-gray-400">
              Try: "Suggest some chill songs for coding" or "What genre is
              trip-hop?"
            </div>
          </div>
        ) : (
          state.messages.map((message: Message) => (
            <MessageBubble key={message.id} message={message} />
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
