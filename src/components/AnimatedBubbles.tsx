import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBubbles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const bubbles: HTMLDivElement[] = [];

    // Create bubbles
    for (let i = 0; i < 15; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'absolute rounded-full pointer-events-none';

      // Random sizes (small to large)
      const size = Math.random() * 60 + 20; // 20-80px
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;

      // Random starting position
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      bubble.style.left = `${startX}px`;
      bubble.style.top = `${startY}px`;

      // Color based on theme with gradient
      if (isDarkMode) {
        const opacity = 0.1 + Math.random() * 0.3; // 0.1-0.4
        bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(0, 82, 255, ${opacity * 0.8}) 0%, rgba(0, 82, 255, ${opacity * 0.4}) 40%, rgba(0, 82, 255, ${opacity * 0.1}) 70%, transparent 100%)`;
      } else {
        const opacity = 0.05 + Math.random() * 0.2; // 0.05-0.25
        bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(0, 82, 255, ${opacity * 0.8}) 0%, rgba(0, 82, 255, ${opacity * 0.4}) 40%, rgba(0, 82, 255, ${opacity * 0.1}) 70%, transparent 100%)`;
      }

      // Add subtle border
      bubble.style.border = `1px solid ${isDarkMode ? 'rgba(0, 82, 255, 0.2)' : 'rgba(0, 82, 255, 0.1)'}`;

      container.appendChild(bubble);
      bubbles.push(bubble);
    }

    // GSAP animations for each bubble
    bubbles.forEach((bubble, index) => {
      // Random movement patterns
      const moveX = (Math.random() - 0.5) * 400; // -200 to 200px
      const moveY = (Math.random() - 0.5) * 400; // -200 to 200px
      const rotation = Math.random() * 720 - 360; // -360 to 360 degrees

      // Main floating animation
      gsap.to(bubble, {
        x: moveX,
        y: moveY,
        rotation: rotation,
        duration: 15 + Math.random() * 10, // 15-25 seconds
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.5
      });

      // Scale pulsing animation
      gsap.to(bubble, {
        scale: 0.8 + Math.random() * 0.4, // 0.8-1.2
        duration: 4 + Math.random() * 3, // 4-7 seconds
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.3
      });

      // Opacity breathing animation
      gsap.to(bubble, {
        opacity: 0.2 + Math.random() * 0.6, // 0.2-0.8
        duration: 3 + Math.random() * 2, // 3-5 seconds
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: index * 0.7
      });

      // Slow rotation
      gsap.to(bubble, {
        rotation: 360,
        duration: 20 + Math.random() * 15, // 20-35 seconds
        ease: "none",
        repeat: -1,
        delay: index * 0.4
      });
    });

    // Mouse interaction - bubbles move away from cursor
    const handleMouseMove = (e: MouseEvent) => {
      bubbles.forEach((bubble, index) => {
        const rect = bubble.getBoundingClientRect();
        const bubbleCenterX = rect.left + rect.width / 2;
        const bubbleCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
          Math.pow(e.clientX - bubbleCenterX, 2) +
          Math.pow(e.clientY - bubbleCenterY, 2)
        );

        if (distance < 150) { // If mouse is within 150px of bubble
          const angle = Math.atan2(
            bubbleCenterY - e.clientY,
            bubbleCenterX - e.clientX
          );

          const pushDistance = (150 - distance) * 0.5;
          const pushX = Math.cos(angle) * pushDistance;
          const pushY = Math.sin(angle) * pushDistance;

          gsap.to(bubble, {
            x: `+=${pushX}`,
            y: `+=${pushY}`,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    };

    // Add mouse move listener
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      bubbles.forEach(bubble => bubble.remove());
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
};

export default AnimatedBubbles;
