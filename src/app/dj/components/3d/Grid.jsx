import { Image, MeshWobbleMaterial, useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  NearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
  TextureLoader,
} from "three";

export default function Grid(props) {
  // const texture = useLoader(TextureLoader, "/grid-x.png");
  // texture.repeat.set(200, 200);
  // texture.wrapS = RepeatWrapping;
  // texture.wrapT = RepeatWrapping;
  // texture.minFilter = NearestFilter;
  // texture.magFilter = NearestFilter;

  // console.log({ texture });

  return (
    <group {...props}>
      {/* <ambientLight intensity={0.2} /> */}
      {/* <directionalLight /> */}
      <gridHelper args={[1000, 200, "orange", "orange"]} />
      {/* <Image
        rotation={[Math.PI / -2, 0, 0]}
        url="/grid.png"
        repeat={[1000, 1000]}
        transparent
        opacity={0.5}
      >
        <planeGeometry args={[1000, 1000, 100, 100]} />
      </Image> */}

      {/* <mesh rotation={[Math.PI / -2, 0, 0]}>
        <planeGeometry args={[1000, 1000, 100, 100]} />
        <meshStandardMaterial
          transparent
          map={texture}
          // color={0xff0000}
          emissive={"orange"}
        />
      </mesh> */}
      {/*}
      <Grid
        cellSize={1}
        cellThickness={2}
        cellColor="orange"
        sectionSize={10}
        sectionThickness={2}
        sectionColor="orange"
        infiniteGrid={true}
        fadeDistance={140}
        fadeStrength={8}
        fadeFrom={1}
      /> */}
    </group>
  );
}
