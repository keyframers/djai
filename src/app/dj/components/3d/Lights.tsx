import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, PointLight, SpotLight } from "three";

export default function Lights() {
  const groupRef = useRef<Group>(null);
  const pointLightRef = useRef<PointLight>(null);
  const spotLightRef = useRef<SpotLight>(null);
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    spotLightRef.current?.position.copy(camera.position);
    spotLightRef.current?.quaternion.copy(camera.quaternion);

    pointLightRef.current?.position.copy(camera.position);
    pointLightRef.current?.quaternion.copy(camera.quaternion);

    return null;
  });

  return (
    <group ref={groupRef}>
      <spotLight
        ref={spotLightRef}
        position={[0, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight
        ref={pointLightRef}
        position={[-10, -5, -10]}
        decay={0}
        intensity={Math.PI}
      />
    </group>
  );
}
