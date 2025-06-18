"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { ScreenSpace } from "@react-three/drei";

import styles from "./Scene.module.css";
import DJ from "./3d/DJ";
import Lights from "./3d/Lights";
import Grid from "./3d/Grid";
import Controls from "./3d/Controls";

import PixelPass from "./3d/PixelPass";
import Timeline3d from "./3d/Timeline3d";

export default function Scene({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <div className={styles.wrapper}>
        <Canvas camera={{ position: [0, 0, 5], fov: 90 }} className="canvas">
          <Controls />

          <fog attach="fog" args={["#171717", 30, 100]} />

          <Grid position={[0, -10, 0]} />

          <PixelPass pixelSize={4} />
          <Lights />

          <Timeline3d />
          <ScreenSpace
            depth={10} // Distance from camera
          >
            <group position={[-9, 0, 0]}>
              {/* <Html sprite transform occlude={false}>
                <ChatView />
              </Html> */}
              <DJ position={[0, 5, 0]} />
            </group>
          </ScreenSpace>
          {children}
        </Canvas>
      </div>
    </>
  );
}
