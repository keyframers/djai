'use client';
import { useSelector } from '@xstate/store/react';
import { appStore } from '@/app/store';
import { shallowEqual } from '@xstate/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Timeline } from './components/Timeline';
import { WelcomeView } from './components/WelcomeView';
import { ExploreView } from './components/ExploreView';
import { SongView } from './components/SongView';
import Scene from './components/Scene';

import styles from './DJ.module.css';
import Button from '@/components/Button';
import { Song } from '../types';

const queryClient = new QueryClient();

export default function DJPage() {
  const state = useSelector(appStore, (state) => state);
  const currentNode = useSelector(
    appStore,
    (state) => {
      return state.context.graph.nodes.find(
        (node) => node.id === state.context.currentNodeId
      );
    },
    shallowEqual
  );

  const handleWelcomeSubmit = (prompt: string) => {
    appStore.trigger.addNode({
      node: {
        view: 'explore',
        prompt,
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  const handleSongSelect = (song: Song) => {
    appStore.trigger.addNode({
      node: {
        view: 'song',
        song,
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  const handleExploreMore = () => {
    appStore.trigger.addNode({
      node: {
        view: 'explore',
        prompt: 'chillwave',
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Scene />
      <div className={styles.root}>
        <Button
          className={styles.modeToggle}
          onClick={() => appStore.trigger.toggleMode()}
        >
          {state.context.mode === 'single' ? 'Show Timeline' : 'Hide Timeline'}
        </Button>

        <div className={styles.content}>
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

          <div className={styles.view}>
            {currentNode?.view === 'welcome' && (
              <WelcomeView onSubmit={handleWelcomeSubmit} />
            )}
            {currentNode?.view === 'explore' && (
              <ExploreView
                prompt={currentNode.prompt}
                onSelectSong={handleSongSelect}
              />
            )}
            {currentNode?.view === 'song' && (
              <SongView
                song={currentNode.song}
                onExploreMore={handleExploreMore}
              />
            )}
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
