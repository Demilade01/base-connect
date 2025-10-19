import React from 'react';
import { motion } from 'framer-motion';
import {
  Link,
  Wallet,
  DollarSign,
  Globe,
  Shield,
  Sparkles
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Link,
      title: 'Wallet Connection',
      description: 'Connect via WalletConnect with QR code or mobile deep link'
    },
    {
      icon: Wallet,
      title: 'Address Display',
      description: 'View your wallet address in a clean, shortened format'
    },
    {
      icon: DollarSign,
      title: 'Balance Display',
      description: 'See your ETH balance on Base network in real-time'
    },
    {
      icon: Globe,
      title: 'Network Info',
      description: 'Display current network (Base Mainnet or Sepolia)'
    },
    {
      icon: Shield,
      title: 'Secure Disconnect',
      description: 'Safely disconnect your wallet when done'
    },
    {
      icon: Sparkles,
      title: 'Smooth Animations',
      description: 'Beautiful transitions powered by Framer Motion'
    }
  ];

  return (
    <motion.div
      className="py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Why Choose BaseConnect?
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          A modern, lightweight dApp that makes Base network interaction simple and secure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-neutral-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="mb-4">
              <feature.icon className="w-12 h-12 text-base-blue" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {feature.title}
            </h3>
            <p className="text-text-secondary">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Features;
