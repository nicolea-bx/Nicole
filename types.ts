
export enum SceneState {
  SCATTERED = 'SCATTERED',
  TREESHAPE = 'TREESHAPE'
}

export interface ParticleData {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  randomness: Float32Array;
}
