"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function ParticlesBackground() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const particleCount = 40;

    // Generate particles ONLY on the client to avoid hydration mismatches
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
      // Drift +/- 20% of the container width/height
      moveX: [0, Math.random() * 40 - 20, Math.random() * 40 - 20],
      moveY: [0, Math.random() * 40 - 20, Math.random() * 40 - 20],
    }));

    setParticles(newParticles);
  }, []);

  // Don't render anything until the client has calculated the particles
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          // Changed to bg-foreground/10 for better visibility in both themes
          className="absolute rounded-full bg-foreground/30"
          style={{
            width: particle.size,
            height: particle.size,
            top: `${particle.initialY}%`,
            left: `${particle.initialX}%`,
          }}
          animate={{
            x: particle.moveX.map((val: number) => `${val}vw`),
            y: particle.moveY.map((val: number) => `${val}vh`),
            opacity: [0.2, 0.6, 0.2], // Increased opacity slightly
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
