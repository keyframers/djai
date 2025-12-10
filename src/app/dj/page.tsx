'use client';
import { useSelector } from '@xstate/store/react';
import { appStore } from '@/app/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Timeline } from './components/Timeline';
import Scene from './components/Scene';

import styles from './DJ.module.css';
import Button from '@/components/Button';
import ChatView from './components/ChatView';

const queryClient = new QueryClient();

export default function DJPage() {
  const state = useSelector(appStore, (state) => state);

  return (
    <QueryClientProvider client={queryClient}>
      <Scene />

      <div className={styles.layout}>
        <ChatView className={styles.chatView} />

        <Button
          className={styles.modeToggle}
          onClick={() => appStore.trigger.toggleMode()}
        >
          {state.context.mode === 'single' ? 'Show Timeline' : 'Hide Timeline'}
        </Button>

        {state.context.mode === 'timeline' && (
          <Timeline
            className={styles.timeline}
            nodes={state.context.graph.nodes}
            edges={state.context.graph.edges}
            currentNodeId={state.context.currentNodeId}
            onNodeSelect={(nodeId) =>
              appStore.trigger.setCurrentNodeId({ nodeId })
            }
          />
        )}
      </div>
    </QueryClientProvider>
  );
}
