import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Loader2 } from 'lucide-react';

const Hero: React.FC = () => {
  const { isConnected, address, isLoading, connect, connectDirect, disconnect } = useWallet();

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr || 'Invalid address';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/20 rounded-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Wallet Connected!
              </h3>
              <p className="text-text-secondary mb-4">
                Address: <span className="font-mono text-base-blue">{address ? formatAddress(address) : 'Loading...'}</span>
              </p>
              <button
                onClick={handleConnect}
                className="bg-error hover:bg-error/80 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="bg-base-blue hover:bg-base-dark-blue disabled:bg-neutral-400 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect via WalletConnect
                  </>
                )}
              </button>
              <button
                onClick={connectDirect}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect Direct (MetaMask)
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-text-secondary">
              Try the direct connection if WalletConnect doesn't work
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Hero;
