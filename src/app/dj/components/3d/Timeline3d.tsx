import { appStore } from "@/app/store";

import { useSelector } from "@xstate/store/react";
import { Bounds, Html, useBounds } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import type { TimelineNode } from "@/app/types";

import { ExploreView } from "../ExploreView";
import { SongView } from "../SongView";

import { Song } from "@/app/types";

export default function Timeline3d() {
  const state = useSelector(appStore, (state) => state);

  const { nodes } = state.context.graph;
  // nodes={state.context.graph.nodes}
  // edges={state.context.graph.edges}
  // currentNodeId={state.context.currentNodeId}
  // onNodeSelect={(nodeId) =>
  //   appStore.trigger.setCurrentNodeId({ nodeId })
  // }

  return (
    <Bounds fit margin={10}>
      <group position={[0, -8, 0]}>
        {nodes.map((node, index) => {
          return <TimelineNodeObject node={node} index={index} key={node.id} />;
        })}
      </group>
    </Bounds>
  );
}

function TimelineNodeObject({
  node,
  index,
}: {
  node: TimelineNode;
  index: number;
}) {
  const groupRef = useRef<Group>(null);
  const state = useSelector(appStore, (state) => state);
  const { currentNodeId } = state.context;
  const api = useBounds();

  const handleSongSelect = (song: Song) => {
    appStore.trigger.addNode({
      node: {
        view: "song",
        song,
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  const handleExploreMore = () => {
    appStore.trigger.addNode({
      node: {
        view: "explore",
        prompt: "chillwave",
        songs: [],
      },
      prevNodeId: state.context.currentNodeId,
    });
  };

  const isCurrent = currentNodeId === node.id;
  useEffect(() => {
    if (isCurrent && groupRef.current) {
      api.refresh(groupRef.current).fit();
    }
  }, [isCurrent, api]);

  return (
    <group
      key={node.id}
      ref={groupRef}
      position={[0, 0, index * 10]}
      onClick={() => appStore.trigger.setCurrentNodeId({ nodeId: node.id })}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={
            node.view === "welcome"
              ? "blue"
              : node.view === "explore"
              ? "green"
              : "red"
          }
        />
      </mesh>

      <Html
        sprite={isCurrent}
        transform
        onClick={() => appStore.trigger.setCurrentNodeId({ nodeId: node.id })}
      >
        {node?.view === "explore" && (
          <ExploreView
            prompt={node.prompt}
            songs={node.songs}
            onSelectSong={handleSongSelect}
          />
        )}
        {node?.view === "song" && (
          <SongView song={node.song} onExploreMore={handleExploreMore} />
        )}
      </Html>
    </group>
  );
}
