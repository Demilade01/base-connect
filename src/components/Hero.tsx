import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <motion.div
      className="text-center py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo/Brand */}
      <motion.div
        className="mb-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="inline-flex items-center justify-center w-20 h-20 bg-base-blue rounded-2xl mb-6">
          {/* Base Logo - Animated gradient circle with horizontal line */}
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #e6f3ff, #ffffff)',
              backgroundSize: '200% 200%'
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div className="w-8 h-1 bg-base-blue rounded-full"></div>
          </motion.div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4">
          BaseConnect
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Connect your wallet to Base network with ease. View balances, manage assets,
          and explore the Base ecosystem seamlessly.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <button className="bg-base-blue hover:bg-base-dark-blue text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          Connect Wallet
        </button>
        <p className="text-sm text-text-secondary mt-4">
          Powered by WalletConnect
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
