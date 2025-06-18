"use client";
import { useSelector } from "@xstate/store/react";
import { appStore } from "@/app/store";
import { shallowEqual } from "@xstate/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Timeline } from "./components/Timeline";
import { WelcomeView } from "./components/WelcomeView";
import { ExploreView } from "./components/ExploreView";
import { SongView } from "./components/SongView";

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
        view: "explore",
        prompt,
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  const handleSongSelect = (songId: string) => {
    appStore.trigger.addNode({
      node: {
        view: "song",
        songId,
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  const handleExploreMore = () => {
    appStore.trigger.addNode({
      node: {
        view: "explore",
        prompt: "Similar songs",
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="">
        <button
          className="mode-toggle"
          onClick={() => appStore.trigger.toggleMode()}
        >
          {state.context.mode === "single" ? "Show Timeline" : "Hide Timeline"}
        </button>

        <div className="content">
          {state.context.mode === "timeline" && (
            <Timeline
              nodes={state.context.graph.nodes}
              edges={state.context.graph.edges}
              currentNodeId={state.context.currentNodeId}
              onNodeSelect={(nodeId) =>
                appStore.trigger.setCurrentNodeId({ nodeId })
              }
            />
          )}

          <div className="view">
            {currentNode?.view === "welcome" && (
              <WelcomeView onSubmit={handleWelcomeSubmit} />
            )}
            {currentNode?.view === "explore" && (
              <ExploreView
                prompt={currentNode.prompt}
                onSelectSong={handleSongSelect}
              />
            )}
            {currentNode?.view === "song" && (
              <SongView
                songId={currentNode.songId}
                onExploreMore={handleExploreMore}
              />
            )}
          </div>
        </div>

        <style jsx>{`
          .mode-toggle {
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            background: #333;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 100;
            font-size: 1rem;
            transition: background 0.2s;
          }
          .mode-toggle:hover {
            background: #444;
          }
          .content {
            display: grid;
            grid-template-columns: ${state.context.mode === "timeline"
              ? "300px 1fr"
              : "1fr"};
            gap: 2rem;
            margin-top: 3rem;
            height: calc(100vh - 7rem);
          }
          .view {
            min-height: 70vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    </QueryClientProvider>
  );
}
