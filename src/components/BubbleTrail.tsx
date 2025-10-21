import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

const BubbleTrail: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const trailBubbles = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let isMouseMoving = false;

    const createTrailBubble = (x: number, y: number) => {
      const bubble = document.createElement('div');
      bubble.className = 'absolute rounded-full pointer-events-none';

      const size = 8 + Math.random() * 12; // 8-20px
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${x - size/2}px`;
      bubble.style.top = `${y - size/2}px`;

      // Theme-based colors
      if (isDarkMode) {
        bubble.style.background = `radial-gradient(circle, rgba(0, 82, 255, 0.8) 0%, rgba(0, 82, 255, 0.4) 50%, transparent 100%)`;
        bubble.style.border = '1px solid rgba(0, 82, 255, 0.6)';
      } else {
        bubble.style.background = `radial-gradient(circle, rgba(0, 82, 255, 0.6) 0%, rgba(0, 82, 255, 0.3) 50%, transparent 100%)`;
        bubble.style.border = '1px solid rgba(0, 82, 255, 0.4)';
      }

      container.appendChild(bubble);
      trailBubbles.current.push(bubble);

      // Animate bubble
      gsap.fromTo(bubble,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => {
            bubble.remove();
            const index = trailBubbles.current.indexOf(bubble);
            if (index > -1) {
              trailBubbles.current.splice(index, 1);
            }
          }
        }
      );

      // Floating animation
      gsap.to(bubble, {
        y: `-=${20 + Math.random() * 30}`,
        x: `+=${(Math.random() - 0.5) * 20}`,
        rotation: Math.random() * 360,
        duration: 1.5,
        ease: "sine.out"
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseMoving = true;

      // Create trail bubble occasionally
      if (Math.random() < 0.3) { // 30% chance
        createTrailBubble(mouseX, mouseY);
      }
    };

    const handleMouseLeave = () => {
      isMouseMoving = false;
    };

    // Continuous trail when mouse is moving
    const createContinuousTrail = () => {
      if (isMouseMoving && Math.random() < 0.1) { // 10% chance per frame
        createTrailBubble(mouseX, mouseY);
      }
      requestAnimationFrame(createContinuousTrail);
    };

    createContinuousTrail();

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      trailBubbles.current.forEach(bubble => bubble.remove());
    };
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
    />
  );
};

export default BubbleTrail;
