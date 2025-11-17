'use client';

import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Stars } from '@react-three/drei';
import { DoubleSide } from 'three';

export default function DeepSpaceScene() {
  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden rounded-3xl bg-black">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <color attach="background" args={['#02030f']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[3, 3, 3]} intensity={1.5} color="#a78bfa" />
        <pointLight position={[-3, -3, -3]} intensity={1.2} color="#60a5fa" />
        <Stars radius={120} depth={60} count={3000} factor={4} fade speed={1} />
        <Float speed={1.8} rotationIntensity={1} floatIntensity={1.5}>
          <Spaceship />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.2} />
      </Canvas>
    </div>
  );
}

function Spaceship() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.6, 4, 32]} />
        <meshStandardMaterial color="#e0e7ff" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0, 1.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.4, 1, 32]} />
        <meshStandardMaterial color="#c084fc" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, -2, 0]}>
        <coneGeometry args={[0.6, 1.4, 32]} />
        <meshStandardMaterial color="#38bdf8" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[1.4, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.6, 0.15, 0.8]} />
        <meshStandardMaterial color="#a5b4fc" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[-1.4, -0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[1.6, 0.15, 0.8]} />
        <meshStandardMaterial color="#a5b4fc" metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[0, -2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 1.5, 64]} />
        <meshBasicMaterial color="#f0abfc" side={DoubleSide} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
