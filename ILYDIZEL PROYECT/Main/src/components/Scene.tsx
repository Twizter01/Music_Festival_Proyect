import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const FloatingImage = ({ position, url }: { position: [number, number, number]; url: string }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
  });

  return (
    <mesh ref={mesh} position={position}>
      <planeGeometry args={[2, 1.5]} />
      <meshStandardMaterial 
        map={texture} 
        metalness={0.9} 
        roughness={0.1}
        emissive={new THREE.Color("#ff00ff")}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

const MetallicBackground = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#ff00ff');
    gradient.addColorStop(0.5, '#000000');
    gradient.addColorStop(1, '#00ffff');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);

    // Add some Y2K-style grid
    context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    context.lineWidth = 1;
    for (let i = 0; i < 256; i += 16) {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(256, i);
      context.stroke();
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 256);
      context.stroke();
    }
  }
  const gradientTexture = new THREE.CanvasTexture(canvas);
  gradientTexture.needsUpdate = true;

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.08;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -5]}>
      <torusGeometry args={[8, 3, 32, 100]} />
      <meshStandardMaterial
        color={new THREE.Color("#000000")}
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1}
        map={gradientTexture}
        emissive={new THREE.Color("#00ffff")}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export const Scene = () => {
  const images = [
    'https://picsum.photos/seed/y2k1/800/600',
    'https://picsum.photos/seed/y2k2/800/600',
    'https://picsum.photos/seed/y2k3/800/600'
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff00ff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
      <MetallicBackground />
      {images.map((url, index) => (
        <FloatingImage
          key={url}
          url={url}
          position={[
            Math.cos((index / images.length) * Math.PI * 2) * 4,
            0,
            Math.sin((index / images.length) * Math.PI * 2) * 4,
          ]}
        />
      ))}
    </>
  );
};