"use client";
import { useFrame, useThree } from "@react-three/fiber";
import React, { useRef, type ComponentProps } from "react";
import { Group, Vector3 } from "three";

const offset = new Vector3(-2, 0.25, 0);

export default function DJ(props: ComponentProps<"group">) {
  const groupRef = useRef<Group>(null);
  const camera = useThree((state) => state.camera);

  useFrame(() => {
    groupRef.current?.lookAt(camera.position.clone().add(offset));
    // if (groupRef.current) {
    //   const target = camera.position.clone();
    //   const up = camera.up.clone();
    //   const position = groupRef.current.position.clone();

    //   // Create a temporary matrix to compute the look-at rotation
    //   const m = new Group().matrix;
    //   m.lookAt(position, target, up);

    //   // Create a quaternion from the look-at matrix
    //   const lookAtQuat = groupRef.current.quaternion.clone();
    //   lookAtQuat.setFromRotationMatrix(m);

    //   // Slerp towards the look-at quaternion
    //   groupRef.current.quaternion.slerp(lookAtQuat, 0.1);
    // }
  });

  return (
    <group ref={groupRef} {...props}>
      <Head />
      <Body position={[0, -1.8, 0]} />
    </group>
  );
}

function Body(props: ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      <Arm position={[-1, 0, 0]} />
      <Arm position={[1, 0, 0]} />
    </group>
  );
}

function Arm(props: ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.5, 1.5, 0.5]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
}

function Head(props: ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh>
        <boxGeometry args={[5, 2, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      <Eye position={[-1.5, 0, 0.5]} />
      <Eye position={[1.5, 0, 0.5]} />
      <Mouth position={[0, -0.5, 0.5]} />

      <Handle position={[0, 1, 0]} />
    </group>
  );
}

function Eye(props: ComponentProps<"mesh">) {
  return (
    <mesh {...props} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.8, 0.5, 0.3, 12, 1]} />
      <meshStandardMaterial color="#666" />
    </mesh>
  );
}

function Mouth(props: ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[-0.45, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.45, 0, 0]}>
        <boxGeometry args={[0.35, 0.25, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}

function Handle(props: ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[0.1, 1, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4.1, 0.25, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[0.1, 1, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>
  );
}
