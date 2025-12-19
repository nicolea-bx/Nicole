
import React from 'react';
import { SceneState } from '../types';

interface UIOverlayProps {
  state: SceneState;
  onToggle: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ state, onToggle }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-pink-100 text-4xl md:text-6xl font-serif tracking-tight leading-none drop-shadow-2xl">
            Christmas <br />
            <span className="text-pink-300 italic">Luminescence</span>
          </h1>
          <p className="text-pink-200/60 mt-4 text-sm md:text-base max-w-xs font-light tracking-widest uppercase">
            A high-fidelity particle study in luxury and motion.
          </p>
        </div>
        
        <div className="hidden md:block text-right">
          <p className="text-pink-300 text-xs tracking-widest font-bold uppercase">Artist Edition</p>
          <p className="text-white/40 text-[10px] tracking-[0.2em] mt-1 uppercase">Series 2024.12</p>
        </div>
      </div>

      {/* Middle Hint - Only shown in Scattered mode */}
      {state === SceneState.SCATTERED && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-40">
           <p className="text-pink-100/50 text-xs tracking-[0.5em] uppercase animate-pulse">
             Waiting for the transition...
           </p>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="max-w-xs pointer-events-auto">
          <p className="text-pink-200/80 text-xs leading-relaxed hidden md:block">
            Exploring the boundary between entropy and structure. 
            All {15000} particles are physically simulated to reflect the cinematic luxury of silver-pink metals.
          </p>
        </div>

        <div className="flex flex-col items-end gap-6 pointer-events-auto">
          <div className="flex gap-4 items-center mb-2">
             <div className="text-right">
               <span className="block text-[10px] text-pink-300/50 uppercase tracking-widest">Current State</span>
               <span className="block text-white font-serif italic text-xl">
                 {state === SceneState.SCATTERED ? 'Celestial Chaos' : 'Divine Geometry'}
               </span>
             </div>
          </div>
          
          <button
            onClick={onToggle}
            className="group relative px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-pink-300/50 transition-all duration-700 rounded-full overflow-hidden"
          >
            {/* Animated Gradient Border Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-400/20 to-pink-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            
            <span className="relative text-white tracking-[0.3em] uppercase text-xs font-bold transition-colors group-hover:text-pink-100">
              {state === SceneState.SCATTERED ? 'Assemble Tree' : 'Scatter Particles'}
            </span>
          </button>
          
          <div className="flex gap-4 text-white/40 text-[10px] tracking-widest uppercase mt-4">
             <span>v19.0.0-react</span>
             <span>|</span>
             <span>RTF.v8.1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
