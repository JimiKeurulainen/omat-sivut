import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { Gltf, useGLTF } from '@react-three/drei';
import { Scene } from 'three';


function Model(props: any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>(null);
  const car = useGLTF('../sportscar.glb');
  console.log(car)
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // const scene = new Scene;
  // scene.add(car);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current && (ref.current.rotation.x += delta)))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={1}
      onClick={(event: any) => click(!clicked)}
      onPointerOver={(event: any) => hover(true)}
      onPointerOut={(event: any) => hover(false)}
      >
      <Gltf src='../sportscar.glb'></Gltf>
    </mesh>
  );
}

export default Model;
