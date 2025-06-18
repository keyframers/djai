"use client";
import { CameraShake, OrbitControls } from "@react-three/drei";

export default function Controls() {
  // const camera = useThree((state) => state.camera);
  // const target = useRef({ x: 0, y: 0 });

  // useEffect(() => {
  //   function onPointerMove(e: MouseEvent) {
  //     // Normalize cursor position to [-1, 1]
  //     const x = (e.clientX / window.innerWidth) * 2 - 1;
  //     const y = -(e.clientY / window.innerHeight) * 2 + 1;
  //     target.current.x = x;
  //     target.current.y = y;
  //   }
  //   window.addEventListener("pointermove", onPointerMove);
  //   return () => window.removeEventListener("pointermove", onPointerMove);
  // }, []);

  // useFrame(() => {
  //   // Slightly offset camera target based on cursor, but keep OrbitControls functional
  //   camera.position.x += (target.current.x * 2 - camera.position.x) * 0.02;
  //   camera.position.y += (target.current.y * 1 - camera.position.y) * 0.02;
  //   camera.updateProjectionMatrix();
  // });

  return (
    <>
      <Rig />
      <OrbitControls makeDefault />
    </>
  );
}

function Rig() {
  // const vec = useRef(new Vector3());
  // const { camera, mouse } = useThree();
  // useFrame(() =>
  //   camera.position.lerp(vec.current.set(mouse.x * 2, 0, 0), 0.05)
  // );

  return (
    <CameraShake
      maxYaw={0.01}
      maxPitch={0.01}
      maxRoll={0.01}
      yawFrequency={0.25}
      pitchFrequency={0.25}
      rollFrequency={0.14}
    />
  );
}
