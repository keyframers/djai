import { createStore } from '@xstate/store';
import { Song, TimelineGraph, TimelineNode } from './types';
import { produce } from 'immer';
import { ChatMessage } from './dj/actions';

const createUniqueId = () => {
  return crypto.randomUUID().slice(0, 8);
};

export const suggestionStore = createStore({
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

const initialNode: TimelineNode = {
  id: createUniqueId(),
  view: 'welcome',
};

const initialGraph: TimelineGraph = {
  initialNodeId: initialNode.id,
  nodes: [initialNode],
  edges: [],
};

type AddNodeEvent = {
  prevNodeId?: string;
  node:
    | { view: 'welcome' }
    | { view: 'explore'; prompt: string; songs: Song[] }
    | { view: 'song'; song: Song };
};

export const appStore = createStore({
  context: {
    graph: initialGraph,
    currentNodeId: initialGraph.initialNodeId,
    mode: 'single' as 'single' | 'timeline',
    messages: [] as ChatMessage[],
  },
  on: {
    addNode: (context, event: AddNodeEvent) =>
      produce(context, (draft) => {
        const prevNodeId = event.prevNodeId ?? context.currentNodeId;
        const newNode = {
          id: createUniqueId(),
          ...event.node,
        };
        draft.graph.nodes.push(newNode as TimelineNode);
        draft.graph.edges.push({
          id: createUniqueId(),
          source: prevNodeId,
          target: newNode.id,
        });
        draft.currentNodeId = newNode.id;
      }),
    setCurrentNodeId: (context, event: { nodeId: string }) => ({
      ...context,
      currentNodeId: event.nodeId,
    }),
    toggleMode: (context) => ({
      ...context,
      mode:
        context.mode === 'single' ? ('timeline' as const) : ('single' as const),
    }),
    setMessages: (context, event: { messages: ChatMessage[] }) => ({
      ...context,
      messages: event.messages,
    }),
  },
});
