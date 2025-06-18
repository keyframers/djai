import { appStore } from "@/app/store";

import { useSelector } from "@xstate/store/react";
import { Bounds, Html, useBounds } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { Group } from "three";
import type { TimelineNode } from "@/app/types";

import { ExploreView } from "../ExploreView";
import { SongView } from "../SongView";

import { Song } from "@/app/types";
import { calculateForceLayout } from "../forceLayout";

export default function Timeline3d() {
  return (
    <Bounds fit clip margin={10}>
      <TimelineInner />
    </Bounds>
  );
}

function TimelineInner() {
  const state = useSelector(appStore, (state) => state);

  const nodePositions = useMemo(() => {
    return calculateForceLayout(state.context.graph, {
      width: 300,
      height: 300,
      linkDistance: 1,
      chargeStrength: -400,
    });
  }, [state.context.graph]);

  return (
    <group>
      {nodePositions.map((nodePosition) => {
        const { x, y, node } = nodePosition;
        return (
          <TimelineNodeObject
            node={node}
            position={[x * 0.25, 0, y * 0.25]}
            key={node.id}
          />
        );
      })}
    </group>
  );
}

function TimelineNodeObject({
  node,
  position,
}: {
  position: [number, number, number];
  node: TimelineNode;
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
      position={position}
      onClick={() => appStore.trigger.setCurrentNodeId({ nodeId: node.id })}
    >
      {/* <mesh>
        <boxGeometry args={[1, 10, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh> */}
      <mesh position={[0, -8, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={"orange"}
          transparent
          opacity={isCurrent ? 1 : 0.5}
        />
      </mesh>

      {isCurrent && (
        <Html
          position={[0, -5, 0]}
          sprite
          transform
          onClick={() => appStore.trigger.setCurrentNodeId({ nodeId: node.id })}
          style={{ opacity: isCurrent ? 1 : 0.8 }}
        >
          <div
            onClick={
              isCurrent
                ? undefined
                : (e) => {
                    e.preventDefault();
                    appStore.trigger.setCurrentNodeId({ nodeId: node.id });
                  }
            }
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
          </div>
        </Html>
      )}
    </group>
  );
}
