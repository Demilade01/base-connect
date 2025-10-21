import React from 'react';
import ThemeToggle from './ThemeToggle';
import AnimatedBackground from './AnimatedBackground';
import FloatingParticles from './FloatingParticles';
import AnimatedBubbles from './AnimatedBubbles';
import InteractiveBubbles from './InteractiveBubbles';
import BubbleTrail from './BubbleTrail';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-800 dark:to-neutral-900 transition-all duration-300 relative overflow-hidden">
      <AnimatedBackground />
      <FloatingParticles />
      <AnimatedBubbles />
      <InteractiveBubbles />
      <BubbleTrail />
      <ThemeToggle />
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl relative z-10">
        <div className="space-y-6 sm:space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
