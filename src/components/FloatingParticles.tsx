import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

const FloatingParticles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    // Create particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full pointer-events-none';

      const size = Math.random() * 4 + 2; // 2-6px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Color based on theme
      if (isDarkMode) {
        particle.style.background = `rgba(0, 82, 255, ${0.3 + Math.random() * 0.4})`;
      } else {
        particle.style.background = `rgba(0, 82, 255, ${0.2 + Math.random() * 0.3})`;
      }

      // Random starting position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      container.appendChild(particle);
      particles.push(particle);
    }

    // GSAP animations
    particles.forEach((particle, index) => {
      // Floating up animation
      gsap.to(particle, {
        y: `-=${window.innerHeight + 100}`,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: 360,
        duration: 15 + Math.random() * 10, // 15-25 seconds
        ease: "none",
        repeat: -1,
        delay: index * 0.5
      });

      // Opacity animation
      gsap.to(particle, {
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        repeat: -1,
        yoyo: true,
        delay: index * 0.3
      });

      // Scale animation
      gsap.to(particle, {
        scale: 0.5 + Math.random() * 1,
        duration: 3 + Math.random() * 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.7
      });
    });

    // Cleanup
    return () => {
      particles.forEach(particle => particle.remove());
    };
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
};

export default FloatingParticles;
