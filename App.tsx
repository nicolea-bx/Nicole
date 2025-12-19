
import React, { useState, useCallback } from 'react';
import Experience from './components/Experience';
import UIOverlay from './components/UIOverlay';
import { SceneState } from './types';

const App: React.FC = () => {
  const [sceneState, setSceneState] = useState<SceneState>(SceneState.SCATTERED);

  const toggleState = useCallback(() => {
    setSceneState(prev => 
      prev === SceneState.SCATTERED ? SceneState.TREESHAPE : SceneState.SCATTERED
    );
  }, []);

  return (
    <main className="relative w-screen h-screen bg-[#1a0505] overflow-hidden">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Experience state={sceneState} />
      </div>

      {/* UI Overlay Layer */}
      <UIOverlay state={sceneState} onToggle={toggleState} />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Grain Texture (Optional Feel) */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Edge Glow */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(26,5,5,1)]" />
      </div>
    </main>
  );
};

export default App;
