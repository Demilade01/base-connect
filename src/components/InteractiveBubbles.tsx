import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

interface Bubble {
  element: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'small' | 'medium' | 'large';
}

const InteractiveBubbles: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const bubbles: Bubble[] = [];

    // Create different types of bubbles
    // @ts-ignore
    const createBubble = (type: 'small' | 'medium' | 'large', index: number): Bubble => {
      const bubble = document.createElement('div');
      bubble.className = 'absolute rounded-full pointer-events-none';

      let size: number;
      let opacity: number;

      switch (type) {
        
        case 'small':
          size = 15 + Math.random() * 10; // 15-25px
          opacity = 0.3 + Math.random() * 0.4; // 0.3-0.7
          break;
        case 'medium':
          size = 30 + Math.random() * 20; // 30-50px
          opacity = 0.2 + Math.random() * 0.3; // 0.2-0.5
          break;
        case 'large':
          size = 50 + Math.random() * 30; // 50-80px
          opacity = 0.1 + Math.random() * 0.2; // 0.1-0.3
          break;
      }

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.opacity = opacity.toString();

      // Random starting position
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      bubble.style.left = `${x}px`;
      bubble.style.top = `${y}px`;

      // Theme-based colors
      if (isDarkMode) {
        bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(0, 82, 255, 0.6) 0%, rgba(0, 82, 255, 0.3) 50%, rgba(0, 82, 255, 0.1) 100%)`;
        bubble.style.border = '1px solid rgba(0, 82, 255, 0.3)';
      } else {
        bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(0, 82, 255, 0.4) 0%, rgba(0, 82, 255, 0.2) 50%, rgba(0, 82, 255, 0.05) 100%)`;
        bubble.style.border = '1px solid rgba(0, 82, 255, 0.2)';
      }

      container.appendChild(bubble);

      return {
        element: bubble,
        x,
        y,
        vx: (Math.random() - 0.5) * 2, // -1 to 1
        vy: (Math.random() - 0.5) * 2, // -1 to 1
        size,
        type
      };
    };

    // Create bubbles
    for (let i = 0; i < 8; i++) {
      const type = i < 3 ? 'large' : i < 6 ? 'medium' : 'small';
      bubbles.push(createBubble(type, i));
    }

    bubblesRef.current = bubbles;

    // Animation loop
    const animate = () => {
      bubbles.forEach((bubble, index) => {
        // Update position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Bounce off edges
        if (bubble.x <= 0 || bubble.x >= window.innerWidth - bubble.size) {
          bubble.vx *= -1;
        }
        if (bubble.y <= 0 || bubble.y >= window.innerHeight - bubble.size) {
          bubble.vy *= -1;
        }

        // Keep within bounds
        bubble.x = Math.max(0, Math.min(window.innerWidth - bubble.size, bubble.x));
        bubble.y = Math.max(0, Math.min(window.innerHeight - bubble.size, bubble.y));

        // Apply position
        bubble.element.style.left = `${bubble.x}px`;
        bubble.element.style.top = `${bubble.y}px`;

        // Add subtle rotation
        const rotation = (Date.now() * 0.001 + index) * 10;
        bubble.element.style.transform = `rotate(${rotation}deg)`;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      bubbles.forEach((bubble) => {
        const dx = mouseX - (bubble.x + bubble.size / 2);
        const dy = mouseY - (bubble.y + bubble.size / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) { // Interaction radius
          const force = (200 - distance) / 200;
          const angle = Math.atan2(dy, dx);

          // Push bubbles away from mouse
          bubble.vx += Math.cos(angle) * force * 0.5;
          bubble.vy += Math.sin(angle) * force * 0.5;

          // Limit velocity
          const maxVel = bubble.type === 'large' ? 1 : bubble.type === 'medium' ? 1.5 : 2;
          bubble.vx = Math.max(-maxVel, Math.min(maxVel, bubble.vx));
          bubble.vy = Math.max(-maxVel, Math.min(maxVel, bubble.vy));
        }
      });
    };

    // Click interaction - create new bubble
    const handleClick = (e: MouseEvent) => {
      const newBubble = createBubble('small', bubbles.length);
      newBubble.x = e.clientX - newBubble.size / 2;
      newBubble.y = e.clientY - newBubble.size / 2;
      newBubble.vx = (Math.random() - 0.5) * 4;
      newBubble.vy = (Math.random() - 0.5) * 4;

      bubbles.push(newBubble);
      bubblesRef.current = bubbles;

      // Animate entrance
      gsap.fromTo(newBubble.element,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: newBubble.element.style.opacity, duration: 0.5, ease: "back.out(1.7)" }
      );
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      bubbles.forEach(bubble => bubble.element.remove());
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-auto overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
};

export default InteractiveBubbles;
