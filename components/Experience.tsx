
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import ParticleSystem from './ParticleSystem';
import { SceneState } from '../types';
import { COLORS } from '../constants';

interface ExperienceProps {
  state: SceneState;
}

const Experience: React.FC<ExperienceProps> = ({ state }) => {
  return (
    <div className="w-full h-screen relative bg-[#1a0505]">
      {/* Dynamic Background Haze */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a0505] via-[#4a0e0e] to-[#1a0505] opacity-50 pointer-events-none" />
      
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: false, stencil: false, depth: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          autoRotate 
          autoRotateSpeed={state === SceneState.SCATTERED ? 0.2 : 0.8}
          minDistance={5}
          maxDistance={30}
        />

        <color attach="background" args={[COLORS.BG_DEEP_RED]} />
        <fog attach="fog" args={[COLORS.BG_DEEP_RED, 10, 50]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={COLORS.PINK_LIGHT} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={COLORS.GOLD} />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <ParticleSystem state={state} />
          </Float>
          
          {/* Subtle atmosphere */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom 
            luminanceThreshold={0.1} 
            mipmapBlur 
            intensity={1.5} 
            radius={0.4} 
          />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Experience;
