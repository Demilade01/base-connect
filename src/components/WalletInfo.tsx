import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Copy, ExternalLink, RefreshCw, CheckCircle, AlertCircle, Network, Coins } from 'lucide-react';

const WalletInfo: React.FC = () => {
  const { address, chainId, balance, isLoading, error } = useWallet();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 10) return addr || 'Invalid address';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const refreshBalance = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  // GSAP animations
  useEffect(() => {
    if (cardRef.current) {
      // Entrance animation
      gsap.fromTo(cardRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5
        }
      );

      // Hover effects
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          y: -5,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      cardRef.current.addEventListener('mouseenter', handleMouseEnter);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (cardRef.current) {
          cardRef.current.removeEventListener('mouseenter', handleMouseEnter);
          cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, []);

  const openExplorer = () => {
    if (address && chainId) {
      const explorerUrl = chainId === 8453
        ? `https://basescan.org/address/${address}`
        : `https://sepolia.basescan.org/address/${address}`;
      window.open(explorerUrl, '_blank');
    }
  };

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 8453:
        return 'Base Mainnet';
      case 84532:
        return 'Base Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  const getNetworkColor = (chainId: number) => {
    switch (chainId) {
      case 8453:
        return 'text-success';
      case 84532:
        return 'text-warning';
      default:
        return 'text-error';
    }
  };

  // Skeleton loading component
  const SkeletonCard = () => (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-32"></div>
            <div className="h-3 bg-neutral-200 rounded w-24"></div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-neutral-50 rounded-xl p-4">
              <div className="h-3 bg-neutral-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Show loading skeleton
  if (isLoading && !address) {
    return <SkeletonCard />;
  }

  // Show connection prompt when no wallet is connected
  if (!address) {
    return (
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            className="w-12 h-12 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet className="w-6 h-6 text-neutral-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-semibold text-text-primary">Connect Your Wallet</h3>
            <p className="text-text-secondary">Connect to Base network to get started</p>
          </div>
        </div>

        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-base-blue/10 to-base-blue/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-base-blue" />
            </div>
          </motion.div>

          <p className="text-text-secondary mb-4">
            No wallet detected. Please connect your wallet to continue.
          </p>

          <AnimatePresence>
            {error && (
              <motion.div
                className="bg-error/10 border border-error/20 rounded-xl p-4 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                  <p className="text-error text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-neutral-200 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-base-blue to-base-dark-blue rounded-full flex items-center justify-center shadow-lg"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Wallet className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Wallet Connected</h3>
          <p className="text-text-secondary">Your Base network wallet</p>
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Address */}
        <motion.div
          className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4 border border-neutral-200 dark:border-neutral-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Wallet Address
              </p>
              <p className="font-mono text-base-blue text-xs sm:text-sm break-all">{address ? formatAddress(address) : 'Loading...'}</p>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={copyAddress}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors relative touch-manipulation"
                title="Copy address"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                    >
                      <CheckCircle className="w-4 h-4 text-success" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="copy"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <Copy className="w-4 h-4 text-text-secondary" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                onClick={openExplorer}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors touch-manipulation"
                title="View on explorer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ExternalLink className="w-4 h-4 text-text-secondary" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Network */}
        <motion.div
          className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4 border border-neutral-200 dark:border-neutral-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1 flex items-center gap-2">
                <Network className="w-4 h-4" />
                Network
              </p>
              <p className={`font-semibold ${chainId ? getNetworkColor(chainId) : 'text-error'}`}>
                {chainId ? getNetworkName(chainId) : 'Unknown Network'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  chainId === 8453 ? 'bg-success' : 'bg-warning'
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              ></motion.div>
              <span className="text-sm text-text-secondary">
                Chain ID: {chainId || 'Unknown'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Balance */}
        <motion.div
          className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 rounded-xl p-4 border border-neutral-200 dark:border-neutral-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1 flex items-center gap-2">
                <Coins className="w-4 h-4" />
                ETH Balance
              </p>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <RefreshCw className="w-4 h-4 animate-spin text-base-blue" />
                    <span className="text-base-blue">Loading...</span>
                  </motion.div>
                ) : (
                  <motion.p
                    className="font-semibold text-text-primary"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                  </motion.p>
                )}
              </div>
            </div>
            <motion.button
              onClick={refreshBalance}
              disabled={refreshing}
              className="p-2 hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
              title="Refresh balance"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RefreshCw className={`w-4 h-4 text-text-secondary ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-error/10 dark:bg-error/20 border border-error/20 dark:border-error/30 rounded-xl p-4"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />
                <p className="text-error text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default WalletInfo;
