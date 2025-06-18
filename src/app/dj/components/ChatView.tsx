'use client';

import { useActionState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import {
  sendChatMessage,
  type Song,
  type ChatResponse,
  type ChatState,
  type ChatMessage,
} from '../actions';
import { appStore } from '@/app/store';
import Button from '@/components/Button';
import { useSelector } from '@xstate/store/react';

const initialState: ChatState = {
  messages: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? '...' : 'Send'}
    </Button>
  );
}

const MessageBubble = ({ message }: { message: ChatMessage }) => (
  <div className="flex mb-4" data-role={message.role === 'user'}>
    <div
      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.role === 'user'
          ? 'bg-blue-500 text-white'
          : 'bg-gray-100 text-gray-900'
      }`}
    >
      <p className="whitespace-pre-wrap">{message.content as string}</p>

      {/* {message.role === 'assistant' &&
          message.response &&
          message.response.action.actionType === 'RECOMMEND_SONGS' && (
            <div className="mt-4 space-y-3">
              {message.response.action.songs.map((song, index) => (
                <SongCard key={index} song={song} />
              ))}
            </div>
          )} */}

      <div className="text-xs opacity-70 mt-1">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  </div>
);

export default function ChatView() {
  const [state, formAction] = useActionState(sendChatMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  const messages = useSelector(appStore, (state) => state.context.messages);

  console.log({ messages });

  console.log(state);
  const lastMessage = messages.at(-1);

  useEffect(() => {
    // appStore.trigger.setMessages({
    //   messages: state.messages,
    // });

    if (lastMessage?.role === 'assistant') {
      switch (lastMessage.response?.action.actionType) {
        case 'RECOMMEND_SONGS':
          appStore.trigger.addNode({
            node: {
              view: 'explore',
              prompt: lastMessage.response.action.prompt,
              songs: lastMessage.response.action.songs.map((song) => ({
                ...song,
                tags: [],
              })),
            },
          });
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    appStore.trigger.setMessages({
      messages: state.messages,
    });
  }, [state.messages]);

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto ">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div>placeholder...</div>
        ) : (
          messages.map((message: ChatMessage, i) => (
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
          action={(formData) => {
            // optimistic ui
            appStore.trigger.setMessages({
              messages: [
                ...state.messages,
                {
                  role: 'user',
                  content: formData.get('prompt') as string,
                  timestamp: Date.now(),
                },
              ],
            });
            return formAction(formData);
          }}
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
