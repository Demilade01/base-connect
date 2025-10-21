import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

const Hero: React.FC = () => {
  const { isConnected, address, isLoading, connect, disconnect, error } = useWallet();

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
      className="text-center py-8 sm:py-16"
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
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-4">
          BaseConnect
        </h1>
        <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto px-4">
          Connect your wallet to Base network with ease. View balances, manage assets,
          and explore the Base ecosystem seamlessly.
        </p>
      </motion.div>

      {/* Connection Status */}
      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
            className="space-y-4"
          >
            <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-text-primary mb-2 text-center">
                  🎉 Wallet Connected!
                </h3>
                <p className="text-text-secondary mb-4 text-center">
                  You're now connected to Base network
                </p>
                <div className="bg-white/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-text-secondary mb-1">Wallet Address</p>
                  <p className="font-mono text-base-blue text-sm break-all">
                    {address ? formatAddress(address) : 'Loading...'}
                  </p>
                </div>
              </motion.div>

              <motion.button
                onClick={handleConnect}
                className="w-full bg-error hover:bg-error/80 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Disconnect Wallet
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="bg-error/10 border border-error/20 rounded-xl p-4 max-w-md mx-auto"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                    <p className="text-error text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connection Button */}
            <div className="flex justify-center max-w-2xl mx-auto px-4">
              <motion.button
                onClick={handleConnect}
                disabled={isLoading}
                className="group relative bg-gradient-to-r from-base-blue to-base-dark-blue hover:from-base-dark-blue hover:to-base-blue disabled:from-neutral-400 disabled:to-neutral-400 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-3 overflow-hidden touch-manipulation"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    <span>Connect Wallet</span>
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </>
                )}
              </motion.button>
            </div>

            <motion.p
              className="text-sm text-text-secondary text-center max-w-md mx-auto px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              💡 Connect your wallet to get started with Base network
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Hero;
