
import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SceneState } from '../types';
import { PARTICLE_COUNT, THEME_COLORS } from '../constants';
import { generateScatteredPositions, generateTreePositions } from '../utils/math';

interface ParticleSystemProps {
  state: SceneState;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ state }) => {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  // Generate initial states
  const scatteredPos = useMemo(() => generateScatteredPositions(PARTICLE_COUNT, 15), []);
  const treePos = useMemo(() => generateTreePositions(PARTICLE_COUNT, 10, 4), []);

  const { colors, sizes, randoms } = useMemo(() => {
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const randoms = new Float32Array(PARTICLE_COUNT);
    
    const colorObjs = THEME_COLORS.map(c => new THREE.Color(c));

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color = colorObjs[Math.floor(Math.random() * colorObjs.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.15 + 0.05;
      randoms[i] = Math.random();
    }
    return { colors, sizes, randoms };
  }, []);

  // Animation state tracking
  const transitionProgress = useRef(0);
  const targetProgress = useRef(state === SceneState.TREESHAPE ? 1 : 0);

  useEffect(() => {
    targetProgress.current = state === SceneState.TREESHAPE ? 1 : 0;
  }, [state]);

  useFrame((stateValue, delta) => {
    const { clock } = stateValue;
    const time = clock.getElapsedTime();

    // Smooth transition logic
    transitionProgress.current = THREE.MathUtils.lerp(
      transitionProgress.current,
      targetProgress.current,
      0.03
    );

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = time;
      materialRef.current.uniforms.uTransition.value = transitionProgress.current;
    }

    // Subtle floating rotation
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.1;
    }
  });

  const shaderArgs = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uTransition: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uTransition;
      uniform float uPixelRatio;
      
      attribute float size;
      attribute vec3 color;
      attribute float random;
      attribute vec3 targetPosition;
      
      varying vec3 vColor;
      varying float vRandom;

      void main() {
        vColor = color;
        vRandom = random;

        // Interpolate between scattered and tree position
        // We add some "swirly" motion during transition
        float swirl = sin(uTime * 0.5 + random * 10.0) * 0.5 * (1.0 - abs(uTransition - 0.5) * 2.0);
        
        vec3 pos = mix(position, targetPosition, uTransition);
        
        // Add subtle wave movement
        pos.x += sin(uTime + random * 10.0) * 0.1;
        pos.y += cos(uTime + random * 10.0) * 0.1;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * uPixelRatio * (500.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vRandom;
      uniform float uTime;

      void main() {
        // Soft circular particle
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float strength = 0.05 / distanceToCenter - 0.1;

        // Twinkle effect
        float twinkle = sin(uTime * 3.0 + vRandom * 100.0) * 0.5 + 0.5;
        vec3 finalColor = vColor + (twinkle * 0.2);

        gl_FragColor = vec4(finalColor, strength);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [scatteredPos, treePos]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={scatteredPos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPosition"
          count={PARTICLE_COUNT}
          array={treePos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={PARTICLE_COUNT}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-random"
          count={PARTICLE_COUNT}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        args={[shaderArgs]}
      />
    </points>
  );
};

export default ParticleSystem;
