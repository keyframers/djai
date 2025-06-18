import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export default function Lights() {
  const groupRef = useRef<Group>(null);
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current?.position.copy(camera.position);
      groupRef.current.position.y = -10;
    }
    return null;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -2, 0]}>
        <sphereGeometry args={[75, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="orange" wireframe />
      </mesh>
    </group>
  );
}
