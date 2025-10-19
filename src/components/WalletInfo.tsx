import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { Wallet, Copy, ExternalLink, RefreshCw } from 'lucide-react';

const WalletInfo: React.FC = () => {
  const { address, chainId, balance, isLoading, error } = useWallet();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

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

  if (!address) return null;

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-base-blue rounded-full flex items-center justify-center">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-text-primary">Wallet Connected</h3>
          <p className="text-text-secondary">Your Base network wallet</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Address */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Wallet Address</p>
              <p className="font-mono text-base-blue">{formatAddress(address)}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyAddress}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                title="Copy address"
              >
                <Copy className="w-4 h-4 text-text-secondary" />
              </button>
              <button
                onClick={openExplorer}
                className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="w-4 h-4 text-text-secondary" />
              </button>
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">Network</p>
              <p className={`font-semibold ${getNetworkColor(chainId!)}`}>
                {getNetworkName(chainId!)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                chainId === 8453 ? 'bg-success' : 'bg-warning'
              }`}></div>
              <span className="text-sm text-text-secondary">
                Chain ID: {chainId}
              </span>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-neutral-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary mb-1">ETH Balance</p>
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-base-blue" />
                    <span className="text-base-blue">Loading...</span>
                  </div>
                ) : (
                  <p className="font-semibold text-text-primary">
                    {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-4">
            <p className="text-error text-sm">{error}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WalletInfo;
