'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls, Float } from '@react-three/drei';
import type { ReadmeData } from '@/types';

interface ProductDeskSceneProps {
  favoriteProducts: ReadmeData['products']['favorite_products'];
  recommendedProducts: ReadmeData['products']['recommended_products'];
  hardware: ReadmeData['products']['my_hardware'];
  onSelect: (detail: {
    title: string;
    description: string;
    tags?: string[];
    link?: string;
  }) => void;
  activeTitle?: string | null;
}

type DeviceMeta = {
  id: string;
  type: 'laptop' | 'phone' | 'tablet';
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  detail: {
    title: string;
    description: string;
    tags?: string[];
    link?: string;
  };
};

export default function ProductDeskScene({
  favoriteProducts,
  recommendedProducts,
  hardware,
  onSelect,
  activeTitle,
}: ProductDeskSceneProps) {
  const deviceMetas = useMemo<DeviceMeta[]>(() => {
    const laptopProduct = recommendedProducts[0] ?? favoriteProducts[0];
    const phoneProduct = favoriteProducts[0];
    const tabletProduct = recommendedProducts[1] ?? favoriteProducts[1];

    return [
      {
        id: 'laptop',
        type: 'laptop',
        position: [0, 0.25, 0],
        rotation: [0, Math.PI / 10, 0],
        detail: {
          title: laptopProduct?.name || hardware.computer || '创作电脑',
          description:
            laptopProduct?.intro ||
            '主力 MacBook，负责设计、编程与所有沉浸式创作体验。',
          tags: laptopProduct?.tags,
          link: laptopProduct?.link,
        },
      },
      {
        id: 'phone',
        type: 'phone',
        position: [-2.2, 0.05, 1.3],
        rotation: [0, -Math.PI / 9, Math.PI / 12],
        scale: [0.8, 0.8, 0.8],
        detail: {
          title: phoneProduct?.name || hardware.phone || '随身工作台',
          description: phoneProduct?.intro || '右手里的灵感捕手，随时记录点滴想法。',
          tags: phoneProduct?.tags,
          link: phoneProduct?.link,
        },
      },
      {
        id: 'tablet',
        type: 'tablet',
        position: [2.4, 0.07, 1.4],
        rotation: [0, Math.PI / 12, -Math.PI / 12],
        detail: {
          title: tabletProduct?.name || hardware.tablet || 'Sketch Pad',
          description: tabletProduct?.intro || '手写、思维导图与旅途里的轻量创作。',
          tags: tabletProduct?.tags,
          link: tabletProduct?.link,
        },
      },
    ];
  }, [favoriteProducts, recommendedProducts, hardware]);

  return (
    <div className="relative mt-8 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-slate-100 p-6 text-gray-900 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),transparent_60%)]" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-amber-500/80">创作工作台</p>
          <h3 className="text-2xl font-semibold">俯视视角 · 立体书桌陈列</h3>
          <p className="text-sm text-gray-500">点击任意设备，查看对应的产品灵感。</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          <p>{hardware.phone || 'iPhone'}</p>
          <p>{hardware.computer || 'MacBook'}</p>
          <p>{hardware.tablet || 'iPad'}</p>
        </div>
      </div>

      <div className="relative mt-8 h-[420px] rounded-[32px] border border-white/60 bg-white/50 shadow-inner">
        <Canvas camera={{ position: [0, 7, 6], fov: 42 }}>
          <color attach="background" args={['#0f0c1a']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#fff7ef" />
          <pointLight position={[-5, -2, -2]} intensity={0.5} color="#a5b4fc" />
          <DeskSurface />
          {deviceMetas.map((device) => (
            <DeviceMesh
              key={device.id}
              device={device}
              active={activeTitle === device.detail.title}
              onSelect={onSelect}
            />
          ))}
          <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
        </Canvas>
      </div>
    </div>
  );
}

function DeskSurface() {
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[8, 0.3, 5]} />
        <meshStandardMaterial color="#fcd8a8" />
      </mesh>
      <mesh position={[0, -0.12, 0]}>
        <boxGeometry args={[7.6, 0.05, 4.6]} />
        <meshStandardMaterial color="#f5c07b" roughness={0.6} />
      </mesh>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <mesh position={[0, 0.1, -1.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 1.8, 64]} />
          <meshBasicMaterial color="#fef3c7" transparent opacity={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

function DeviceMesh({
  device,
  active,
  onSelect,
}: {
  device: DeviceMeta;
  active: boolean;
  onSelect: ProductDeskSceneProps['onSelect'];
}) {
  const { type, position, rotation, scale, detail } = device;
  const handleClick = () => onSelect(detail);

  if (type === 'laptop') {
    return (
      <group position={position} rotation={rotation} onClick={handleClick} className="cursor-pointer">
        <mesh>
          <boxGeometry args={[3, 0.12, 2.2]} />
          <meshStandardMaterial
            color={active ? '#a855f7' : '#d1d5db'}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.95, -0.9]} rotation={[Math.PI / 1.9, 0, 0]}>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial
            color={active ? '#e879f9' : '#111827'}
            emissive={active ? '#f472b6' : '#0f172a'}
            emissiveIntensity={active ? 0.6 : 0.2}
          />
        </mesh>
        <Html position={[0, 1.8, -1]} center>
          <button className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold shadow">
            {detail.title}
          </button>
        </Html>
      </group>
    );
  }

  if (type === 'phone') {
    return (
      <group
        position={position}
        rotation={rotation}
        scale={scale}
        onClick={handleClick}
        className="cursor-pointer"
      >
        <mesh>
          <boxGeometry args={[0.7, 0.05, 1.5]} />
          <meshStandardMaterial
            color={active ? '#f97316' : '#1f2937'}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.65, 0.02, 1.4]} />
          <meshStandardMaterial color={active ? '#fde68a' : '#111827'} emissiveIntensity={0.4} />
        </mesh>
        <Html position={[0, 0.9, 0.3]} center>
          <span className="rounded-xl bg-white/80 px-2 py-1 text-[10px] font-semibold shadow">
            {detail.title}
          </span>
        </Html>
      </group>
    );
  }

  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <mesh>
        <boxGeometry args={[1.3, 0.05, 1.8]} />
        <meshStandardMaterial
          color={active ? '#38bdf8' : '#1f2937'}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <planeGeometry args={[1.25, 1.75]} />
        <meshStandardMaterial color={active ? '#bae6fd' : '#111827'} />
      </mesh>
      <Html position={[0, 0.9, 0.3]} center>
        <span className="rounded-xl bg-white/80 px-2 py-1 text-[10px] font-semibold shadow">
          {detail.title}
        </span>
      </Html>
    </group>
  );
}

