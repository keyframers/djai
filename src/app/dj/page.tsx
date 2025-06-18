"use client";
import { useSelector } from "@xstate/store/react";
import { appStore } from "@/app/store";
import { shallowEqual } from "@xstate/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Timeline } from "./components/Timeline";
import { WelcomeView } from "./components/WelcomeView";
import { ExploreView } from "./components/ExploreView";
import { SongView } from "./components/SongView";
import Scene from "./components/Scene";

import styles from "./DJ.module.css";
import Button from "@/components/Button";
import { Song } from "../types";
import { Bounds, Html } from "@react-three/drei";
import ChatView from "./components/ChatView";

const queryClient = new QueryClient();

export default function DJPage() {
  const state = useSelector(appStore, (state) => state);
  // const currentNode = useSelector(
  //   appStore,
  //   (state) => {
  //     return state.context.graph.nodes.find(
  //       (node) => node.id === state.context.currentNodeId
  //     );
  //   },
  //   shallowEqual
  // );

  return (
    <QueryClientProvider client={queryClient}>
      <Scene>
        {/* <Bounds>
          <Html transform sprite={true} occlude={false}></Html>
        </Bounds> */}
      </Scene>

      <div className={styles.layout}>
        <ChatView className={styles.chatView} />
        {/* <div className={styles.content}></div> */}

        <Button
          className={styles.modeToggle}
          onClick={() => appStore.trigger.toggleMode()}
        >
          {state.context.mode === "single" ? "Show Timeline" : "Hide Timeline"}
        </Button>

        {state.context.mode === "timeline" && (
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
