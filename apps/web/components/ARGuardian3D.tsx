'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface ARMascotMeshProps {
  status: 'FOCUSED' | 'WARNING' | 'IDLE';
}

const ARMascotMesh: React.FC<ARMascotMeshProps> = ({ status }) => {
  const coreRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const outerRingRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.8;
      coreRef.current.rotation.x += delta * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.6;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x += delta * 0.5;
    }
  });

  const coreColor =
    status === 'FOCUSED'
      ? '#10b981' // Neon Emerald
      : status === 'WARNING'
      ? '#f59e0b' // Warning Amber
      : '#6366f1'; // Idle Indigo

  return (
    <group>
      {/* Outer Floating Particle Field */}
      <Sparkles count={40} scale={5} size={3} speed={0.4} color={coreColor} />

      {/* Floating 3D Mascot Core */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
        {/* Core Geometry */}
        <mesh ref={coreRef} scale={1.2}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color={coreColor}
            envMapIntensity={0.8}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            metalness={0.3}
            roughness={0.1}
            distort={status === 'WARNING' ? 0.6 : 0.25}
            speed={ status === 'WARNING' ? 4 : 2}
          />
        </mesh>

        {/* Inner Focus Ring */}
        <mesh ref={ringRef} scale={1.8} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1, 0.04, 16, 64]} />
          <meshStandardMaterial color={coreColor} emissive={coreColor} emissiveIntensity={0.6} />
        </mesh>

        {/* Outer Orbiting Aura Ring */}
        <mesh ref={outerRingRef} scale={2.4} rotation={[0, Math.PI / 4, 0]}>
          <torusGeometry args={[1, 0.02, 16, 64]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </group>
  );
};

export interface ARGuardian3DProps {
  status?: 'FOCUSED' | 'WARNING' | 'IDLE';
  className?: string;
}

export const ARGuardian3D: React.FC<ARGuardian3DProps> = ({
  status = 'FOCUSED',
  className = 'w-full h-64',
}) => {
  return (
    <div className={`relative rounded-3xl overflow-hidden bg-zinc-950/80 border border-white/5 ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, -10, -5]} color="#10b981" intensity={1.5} />

        <ARMascotMesh status={status} />
      </Canvas>
    </div>
  );
};
