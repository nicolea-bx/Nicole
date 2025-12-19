
import * as THREE from 'three';

export const generateScatteredPositions = (count: number, range: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * range;
    positions[i * 3 + 1] = (Math.random() - 0.5) * range;
    positions[i * 3 + 2] = (Math.random() - 0.5) * range;
  }
  return positions;
};

export const generateTreePositions = (count: number, height: number, baseRadius: number) => {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Determine height: favor more particles at the bottom for fullness
    const h = Math.pow(Math.random(), 0.8) * height;
    
    // Radius decreases as height increases
    const currentRadius = baseRadius * (1 - h / height);
    
    // Add some organic "spiraling"
    const angle = Math.random() * Math.PI * 2;
    // Add some jitter for volume
    const jitter = (Math.random() - 0.5) * (currentRadius * 0.2);
    
    positions[i * 3] = Math.cos(angle) * (currentRadius + jitter);
    positions[i * 3 + 1] = h - (height / 2); // Center tree vertically
    positions[i * 3 + 2] = Math.sin(angle) * (currentRadius + jitter);
  }
  return positions;
};
