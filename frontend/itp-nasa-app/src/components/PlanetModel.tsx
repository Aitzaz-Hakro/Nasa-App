"use client"
import React, { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF } from "@react-three/drei"

function Planet() {
  const { scene } = useGLTF("/models/fire_planet.glb")
  return <primitive object={scene} scale={2.5} />
}

useGLTF.preload("/models/moon.glb")

export default function PlanetModel() {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Planet />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate={true} />
      </Canvas>
    </div>
  )
}
