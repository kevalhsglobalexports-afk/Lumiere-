
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Float, 
  Environment, 
  ContactShadows,
  PerspectiveCamera
} from '@react-three/drei';
import * as THREE from 'three';

const SerumBottle = () => {
  const group = useRef<THREE.Group>(null!);

  // Gentle rotation logic based on time
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.sin(t / 2) / 4, 0.05);
  });

  return (
    <group ref={group} dispose={null} scale={1.6}>
      {/* Bottle Body - Frosted Glass Effect */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.8, 64]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          transmission={1}
          thickness={0.8}
          roughness={0.1}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Internal Liquid Essence */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 1.4, 32]} />
        <meshStandardMaterial 
          color="#f59e0b" 
          emissive="#fbbf24"
          emissiveIntensity={0.2}
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* Bottle Cap - Gold Metallic PBR */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.32, 0.62, 0.45, 64]} />
        <meshStandardMaterial 
          color="#d97706" 
          metalness={1} 
          roughness={0.1} 
          envMapIntensity={3}
        />
      </mesh>

      {/* Rubber Dropper Top */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.25, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
        <meshStandardMaterial color="#1c1917" roughness={0.6} />
      </mesh>

      {/* Minimalist Label */}
      <mesh position={[0, -0.1, 0.61]}>
        <planeGeometry args={[0.6, 0.9]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  );
};

const Bottle3D: React.FC = () => {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows dpr={[1, 2]} alpha>
        <PerspectiveCamera makeDefault position={[0, 0.5, 6]} fov={35} />
        
        {/* Balanced Cinematic Lighting */}
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={3} castShadow />
        <directionalLight position={[-10, 10, 5]} intensity={2} color="#ffffff" />
        <pointLight position={[5, -5, 5]} intensity={1.5} color="#fbbf24" />
        
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.4}>
          <SerumBottle />
        </Float>

        <ContactShadows 
          position={[0, -2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={5} 
        />
        
        <Environment preset="studio" />
        
        <OrbitControls 
          enableZoom={false} 
          minPolarAngle={Math.PI / 2.5} 
          maxPolarAngle={Math.PI / 1.5} 
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>

      {/* Subtle Interactive Badge */}
      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 pointer-events-none shadow-xl">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-800">3D Interaction Active</span>
      </div>
    </div>
  );
};

export default Bottle3D;
