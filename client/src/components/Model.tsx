import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, ThreeElements, useFrame } from '@react-three/fiber'
import { Gltf, useGLTF } from '@react-three/drei';
import { Scene } from 'three';
import { WireframeMaterial } from '@react-three/drei/materials/WireframeMaterial';


function Model(props: any) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<any>(null);
  const car = useGLTF('../sportscar.glb');
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  // const scene = new Scene;
  // scene.add(car);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current && (ref.current.rotation.y += delta)))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      receiveShadow
      >
      <Gltf src='../sportscar.glb' castShadow></Gltf>
    </mesh>
  );
}

export default Model;
