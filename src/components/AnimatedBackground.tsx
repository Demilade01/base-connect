import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const orbs: HTMLDivElement[] = [];

    // Create orbs
    for (let i = 0; i < 6; i++) {
      const orb = document.createElement('div');
      orb.className = 'absolute rounded-full opacity-20 blur-sm';

      // Random sizes and positions
      const size = Math.random() * 200 + 100; // 100-300px
      const x = Math.random() * 100; // 0-100%
      const y = Math.random() * 100; // 0-100%

      orb.style.width = `${size}px`;
      orb.style.height = `${size}px`;
      orb.style.left = `${x}%`;
      orb.style.top = `${y}%`;

      // Color based on theme
      if (isDarkMode) {
        orb.style.background = `radial-gradient(circle, rgba(0, 82, 255, 0.3) 0%, rgba(0, 82, 255, 0.1) 50%, transparent 100%)`;
      } else {
        orb.style.background = `radial-gradient(circle, rgba(0, 82, 255, 0.2) 0%, rgba(0, 82, 255, 0.05) 50%, transparent 100%)`;
      }

      container.appendChild(orb);
      orbs.push(orb);
    }

    // GSAP animations
    const tl = gsap.timeline({ repeat: -1 });

    orbs.forEach((orb, index) => {
      // Floating animation
      gsap.to(orb, {
        y: `+=${Math.random() * 100 - 50}`,
        x: `+=${Math.random() * 100 - 50}`,
        rotation: 360,
        duration: 8 + Math.random() * 4, // 8-12 seconds
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5
      });

      // Scale animation
      gsap.to(orb, {
        scale: 1.2 + Math.random() * 0.6, // 1.2-1.8
        duration: 6 + Math.random() * 3, // 6-9 seconds
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.3
      });

      // Opacity animation
      gsap.to(orb, {
        opacity: 0.1 + Math.random() * 0.3, // 0.1-0.4
        duration: 4 + Math.random() * 2, // 4-6 seconds
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.7
      });
    });

    // Cleanup
    return () => {
      orbs.forEach(orb => orb.remove());
      tl.kill();
    };
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -1 }}
    />
  );
};

export default AnimatedBackground;
