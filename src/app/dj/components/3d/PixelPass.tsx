import { RenderPixelatedPass } from "three/addons/postprocessing/RenderPixelatedPass.js";
import { extend, useThree } from "@react-three/fiber";
import { Effects } from "@react-three/drei";
extend({ RenderPixelatedPass });

export default function PixelPass({ pixelSize = 6 }) {
  const camera = useThree((state) => state.camera);
  const scene = useThree((state) => state.scene);

  // Only render for a specific layer (e.g., layer 1)
  // Set the camera to only render the desired layer for this pass
  // Save original camera layers to restore after render

  return (
    <Effects>
      {/* @ts-expect-error -- We don't have this declared. */}
      <renderPixelatedPass
        args={[pixelSize, scene, camera]}
        normalEdgeStrength={3}
        depthEdgeStrength={0.15}
      />
    </Effects>
  );
}
