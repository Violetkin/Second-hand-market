import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 1500; // number of particles
const CONNECT_DISTANCE = 0; // Set to > 0 to draw lines between particles (expensive)
const PARTICLE_COLOR = '#10B981'; // Emerald 500

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  friction: number;
  ease: number;
}

export const BioSwarm: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    let time = 0;

    // Initialize particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        targetX: 0,
        targetY: 0,
        size: Math.random() * 1.5 + 0.5, // Random size between 0.5 and 2
        friction: 0.95 + Math.random() * 0.04, // Particle drag
        ease: 0.01 + Math.random() * 0.04, // How fast they follow the target
      });
    }

    const animate = () => {
      // Clear canvas with a very slight fade for "trail" effect (optional, here we do clean clear)
      // ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      // ctx.fillRect(0, 0, width, height);
      ctx.clearRect(0, 0, width, height);

      time += 0.005;

      // The "Organism" Logic
      // We define a parametric curve that moves over time. 
      // This curve represents the "body" of the insect/capsule.
      
      // Oscillation factors for the organism's shape
      const pulse = Math.sin(time * 2) * 50; // Breathing effect
      const rotateX = Math.cos(time * 0.5);
      const rotateY = Math.sin(time * 0.3);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // --- 1. Calculate Target Position (The Shape) ---
        // We map each particle to a specific index along a Lissajous-like curve (Helix Capsule)
        
        // i_normalized goes from 0 to 2*PI * loops
        const idx = i / PARTICLE_COUNT;
        const angle = idx * Math.PI * 2 * 5 + time; // 5 loops for helix structure

        // Base Capsule Shape Math
        // A capsule is elongated on X axis.
        const capsuleWidth = 300 + pulse;
        const capsuleHeight = 100 + pulse * 0.5;

        // Create a 3D-ish helix projected to 2D
        // X spreads out, Y oscillates
        const shapeX = Math.cos(angle) * capsuleWidth * rotateX;
        const shapeY = Math.sin(angle) * capsuleHeight * rotateY + Math.sin(angle * 3) * 30; // Add some organic waviness

        // Center the shape
        p.targetX = width / 2 + shapeX;
        p.targetY = height / 2 + shapeY;

        // --- 2. Physics Update ---
        
        // Calculate distance to target
        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        // Acceleration towards target (Spring force)
        const ax = dx * p.ease;
        const ay = dy * p.ease;

        // Add some random Brownian motion (jitter) to look like bugs/biology
        const jitter = Math.sin(time * 10 + i) * 0.5;

        p.vx += ax + jitter;
        p.vy += ay + jitter;

        // Apply friction
        p.vx *= p.friction;
        p.vy *= p.friction;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // --- 3. Draw ---
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Dynamic Opacity: Particles moving fast are fainter (motion blur simulation)
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const opacity = Math.min(1, Math.max(0.3, 1 - speed * 0.05));
        
        ctx.fillStyle = PARTICLE_COLOR;
        ctx.globalAlpha = opacity;
        ctx.fill();
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-60"
    />
  );
};