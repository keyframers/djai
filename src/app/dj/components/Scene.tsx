"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, ScreenSpace, Html } from "@react-three/drei";

import styles from "./Scene.module.css";
import DJ from "./3d/DJ";
import PixelPass from "./3d/PixelPass";
import Lights from "./3d/Lights";
import Controls from "./Controls";

import ChatView from "./ChatView";

export default function Scene({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <div className={styles.wrapper}>
        <Canvas camera={{ position: [0, 0, 5], fov: 90 }} className="canvas">
          <Controls />

          <Grid /** Cell size, default: 0.5 */
            position={[0, -10, 0]}
            cellSize={1}
            /** Cell thickness, default: 0.5 */
            cellThickness={2}
            /** Cell color, default: black */
            cellColor="orange"
            /** Section size, default: 1 */
            sectionSize={10}
            /** Section thickness, default: 1 */
            sectionThickness={2}
            /** Section color, default: #2080ff */
            sectionColor="orange"
            /** Display the grid infinitely, default: false */
            infiniteGrid={true}
            /** Fade distance, default: 100 */
            fadeDistance={140}
            /** Fade strength, default: 1 */
            fadeStrength={8}
            /** Fade from camera (1) or origin (0), or somewhere in between, default: camera */
            fadeFrom={1}
          />

          <PixelPass pixelSize={4} />
          <Lights />
          <ScreenSpace
            depth={10} // Distance from camera
          >
            <group position={[-8, 0, 0]}>
              <Html sprite transform occlude={false}>
                <ChatView />
              </Html>
              <DJ position={[0, -5, 0]} />
            </group>
          </ScreenSpace>
          {children}
        </Canvas>
      </div>
    </>
  );
}
