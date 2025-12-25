import React from 'react';
import { motion } from 'framer-motion';

// High-quality moss texture from Unsplash (Forest floor/Mossy texture)
const MOSS_TEXTURE_URL = "https://images.unsplash.com/photo-1543007630-9710e4a00a20?q=80&w=1000&auto=format&fit=crop";

export const MossJarHero: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
      
      {/* 1. Cinematic Background (Macro Photography Style) */}
      <div className="absolute inset-0 bg-stone-100">
        {/* Soft Bokeh blobs for lighting */}
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-stone-200/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-emerald-900/10 rounded-full blur-[100px]" />
        
        {/* Vignette for focus */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-900/5" />
      </div>

      {/* 2. The Container for the Jar (Centered) */}
      <div className="relative w-[300px] h-[500px] md:w-[400px] md:h-[600px] perspective-1000">
        
        {/* Shadow underneath */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 1, duration: 1.5 }}
           className="absolute bottom-[-40px] left-10 right-10 h-[40px] bg-black/20 blur-2xl rounded-[100%]"
        />

        {/* THE JAR COMPOSITION */}
        <motion.div
          initial={{ x: '-100vw', rotateY: 15 }}
          animate={{ x: 0, rotateY: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 40, 
            damping: 15, 
            mass: 1.2,
            delay: 0.2 
          }}
          className="relative w-full h-full rounded-[120px] overflow-hidden shadow-2xl"
          style={{ 
            boxShadow: 'inset -20px -20px 60px rgba(0,0,0,0.05), inset 20px 20px 60px rgba(255,255,255,0.8), 0 50px 100px -20px rgba(0,0,0,0.2)'
          }}
        >
          {/* Layer A: Pristine White Matte Ceramic */}
          <div className="absolute inset-0 bg-[#f9fafb] flex items-center justify-center">
             {/* Ceramic Sheen / Highlight */}
             <div className="absolute top-10 right-20 w-20 h-60 bg-gradient-to-b from-white/80 to-transparent rounded-full blur-xl transform -rotate-12" />
          </div>

          {/* Layer B: Lush Green Moss (Eroding from Right) */}
          <motion.div
            initial={{ clipPath: 'inset(0 0 0 100%)' }} // Start fully hidden (masked from right)
            animate={{ clipPath: 'inset(0 0 0 0%)' }}   // Reveal to fully visible
            transition={{ 
              duration: 8, // Slow, organic growth
              ease: "easeInOut",
              delay: 1.8 // Wait for slide-in to finish
            }}
            className="absolute inset-0 bg-emerald-800"
          >
            {/* The Moss Texture Image */}
            <img 
              src={MOSS_TEXTURE_URL} 
              alt="Moss Texture" 
              className="w-full h-full object-cover opacity-90 mix-blend-overlay"
            />
            
            {/* Darken edges for 3D depth on the moss layer too */}
            <div className="absolute inset-0 shadow-[inset_-30px_-20px_60px_rgba(0,0,0,0.5)]" />
            
            {/* Organic Edge Simulation (Noise overlay to make the transition look less like a straight line) */}
            {/* In a real production environment, we'd use an SVG filter here for jagged edges. 
                For this pure CSS/JS version, the smooth inset creates a 'liquid' fill effect. */}
          </motion.div>

        </motion.div>
      </div>

    </div>
  );
};