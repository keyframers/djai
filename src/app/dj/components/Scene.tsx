"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, OrbitControls, ScreenSpace } from "@react-three/drei";

import styles from "./Scene.module.css";
import DJ from "./3d/DJ";
import PixelPass from "./3d/PixelPass";
import Lights from "./3d/Lights";

export default function Scene() {
  return (
    <>
      <div className={styles.wrapper}>
        <Canvas camera={{ position: [5, 5, 5], fov: 90 }} className="canvas">
          <PixelPass pixelSize={4} />
          <Lights />
          <ScreenSpace
            depth={10} // Distance from camera
          >
            <DJ position={[-8, -1, 0]} />
          </ScreenSpace>
          <Grid /** Cell size, default: 0.5 */
            position={[0, -5, 0]}
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
            fadeDistance={100}
            /** Fade strength, default: 1 */
            fadeStrength={8}
            /** Fade from camera (1) or origin (0), or somewhere in between, default: camera */
            fadeFrom={1}
          />
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}
