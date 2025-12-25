import React from 'react';
import { motion } from 'framer-motion';

export const NatureElements: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      
      {/* 1. Ethereal Foreground Fern (Bottom Left) - Soft Focus */}
      <motion.div
        initial={{ opacity: 0, x: -100, rotate: -10 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] text-emerald-100/40 blur-[2px]"
      >
         <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
            <motion.path 
              d="M10,100 Q40,50 90,10 Q80,50 100,90 Q50,80 10,100 Z" 
              animate={{ d: ["M10,100 Q40,50 90,10 Q80,50 100,90 Q50,80 10,100 Z", "M10,100 Q45,55 90,15 Q85,55 100,90 Q50,85 10,100 Z", "M10,100 Q40,50 90,10 Q80,50 100,90 Q50,80 10,100 Z"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
         </svg>
      </motion.div>

      {/* 2. Abstract "Spring Light" Leaf (Top Right) - Glassy */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -top-32 -right-10 w-[500px] h-[500px] text-lime-100/30 blur-2xl mix-blend-multiply"
      >
        <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full">
           <path d="M100,0 C20,40 0,100 0,200 C80,180 160,160 200,100 C160,50 120,0 100,0 Z" />
        </svg>
      </motion.div>

      {/* 3. Drifting Petals/Leaves (Animated) */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-6 bg-gradient-to-br from-emerald-200/40 to-lime-200/20 rounded-full blur-[1px]"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: -20, 
            opacity: 0,
            rotate: Math.random() * 360 
          }}
          animate={{ 
            y: window.innerHeight + 50,
            x: `+=${Math.random() * 100 - 50}`,
            opacity: [0, 0.6, 0],
            rotate: `+=${Math.random() * 360}`
          }}
          transition={{ 
            duration: 15 + Math.random() * 10, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "linear"
          }}
        />
      ))}

      {/* 4. The Dragonfly - Refined & Smaller */}
      <motion.div
        className="absolute top-1/3 left-2/3 w-8 h-8 text-stone-400/50"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.8,
          x: [0, 60, -40, 0], 
          y: [0, -30, 40, 0],
          rotate: [15, 25, 5, 15]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full drop-shadow-sm">
          <line x1="12" y1="5" x2="12" y2="19" />
          <motion.path 
            d="M12 8 C 18 5, 24 6, 24 9 C 24 11, 18 11, 12 9" 
            fill="currentColor" fillOpacity="0.1"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
          <motion.path 
            d="M12 8 C 6 5, 0 6, 0 9 C 0 11, 6 11, 12 9" 
            fill="currentColor" fillOpacity="0.1"
            animate={{ scaleY: [1, 0.4, 1] }}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
        </svg>
      </motion.div>

    </div>
  );
};