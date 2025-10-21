import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      // Initial entrance animation
      gsap.fromTo(buttonRef.current,
        {
          scale: 0,
          rotation: -180,
          opacity: 0
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 1
        }
      );

      // Continuous subtle floating animation
      gsap.to(buttonRef.current, {
        y: -5,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }
  }, []);

  useEffect(() => {
    if (iconRef.current) {
      // Theme change animation
      gsap.to(iconRef.current, {
        rotation: 360,
        scale: 1.2,
        duration: 0.5,
        ease: "back.out(1.7)",
        yoyo: true,
        repeat: 1
      });
    }
  }, [isDarkMode]);

  return (
    <motion.button
      ref={buttonRef}
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        ref={iconRef}
        key={isDarkMode ? 'moon' : 'sun'}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="w-5 h-5"
      >
        {isDarkMode ? (
          <Moon className="w-5 h-5 text-yellow-500" />
        ) : (
          <Sun className="w-5 h-5 text-orange-500" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
