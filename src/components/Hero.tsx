import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, Spacer, Text } from '@geist-ui/core';
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  useSwitchChain,
  type Connector,
} from 'wagmi';
import { Wallet, AlertCircle, ExternalLink, Loader2, Power } from 'lucide-react';
import { walletConnectService } from '../services/walletConnectService';

const ActionButton = Button as React.ComponentType<any>;

const Hero: React.FC = () => {
  const { address, status } = useAccount();
  const chainId = useChainId();
  const { connectors, connect, isPending: isConnecting, error: connectError } = useConnect();
  const { disconnectAsync, isPending: isDisconnecting } = useDisconnect();
  const { switchChain, chains: switchableChains, isPending: isSwitching } = useSwitchChain();
  const [selectedConnectorId, setSelectedConnectorId] = useState<string | null>(null);
  const [wcLoading, setWcLoading] = useState(false);
  const [wcError, setWcError] = useState<string | null>(null);
  const [showNetworks, setShowNetworks] = useState(false);

  const isConnected = status === 'connected' && Boolean(address);

  useEffect(() => {
    if (!isConnecting) {
      setSelectedConnectorId(null);
    }
  }, [isConnecting]);

  const handleWalletConnect = async () => {
    setWcLoading(true);
    setWcError(null);
    try {
      await walletConnectService.connectWithQrModal();
    } catch (err) {
      setWcError(
        err instanceof Error ? err.message : 'Failed to open WalletConnect. Please try again.'
      );
    } finally {
      setWcLoading(false);
    }
  };

  const connectorIdentifier = (connector: Connector) =>
    (connector as Connector & { uid?: string }).uid ?? connector.id;

  const readyConnectors = useMemo(
    () => connectors.filter((connector) => connector.type !== 'mock'),
    [connectors]
  );

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getNetworkName = (id: number | undefined) => {
    if (!id) return 'Unknown Network';
    switch (id) {
      case 8453:
        return 'Base Mainnet';
      case 84532:
        return 'Base Sepolia';
      default:
        return `Chain ${id}`;
    }
  };

  const toggleNetworks = () => setShowNetworks((prev) => !prev);

  const handleConnect = (connector: Connector) => {
    const id = connectorIdentifier(connector);
    setSelectedConnectorId(id);
    connect({ connector });
  };

  const handleDisconnect = async () => {
    setShowNetworks(false);
    await disconnectAsync();
  };

  const handleSwitchChain = (targetId: number) => {
    switchChain?.({ chainId: targetId });
  };

  return (
    <motion.div
      className="text-center py-8 sm:py-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-8 max-w-2xl mx-auto px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-base-blue rounded-2xl mb-6 mx-auto">
          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #e6f3ff, #ffffff)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="w-8 h-1 bg-base-blue rounded-full" />
          </motion.div>
        </div>
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-4">
            BaseConnect
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary">
            Connect your wallet to Base network with ease. View balances, manage assets, and explore
            the Base ecosystem seamlessly.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isConnected ? (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-2xl mx-auto px-2">
              <Card shadow width="100%">
                <Card.Content className="px-4 sm:px-6">
                  <div className="flex flex-col gap-6 max-w-xl mx-auto">
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-success to-success/80 rounded-full flex items-center justify-center shadow-lg">
                        <Wallet className="w-8 h-8 text-white" />
                      </div>
                    </motion.div>
                    <div>
                      <Text h3 className="mb-1">🎉 Wallet Connected</Text>
                      <Text small type="secondary">{getNetworkName(chainId)}</Text>
                    </div>
                    <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-4 text-left">
                      <Text small type="secondary">Wallet Address</Text>
                      <Text className="font-mono text-base-blue break-all">{formatAddress(address)}</Text>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ActionButton
                        auto
                        scale={1}
                        icon={<Power className="w-4 h-4" />}
                        onClick={handleDisconnect}
                        disabled={isDisconnecting}
                      >
                        {isDisconnecting ? 'Disconnecting...' : 'Disconnect Wallet'}
                      </ActionButton>
                      {switchableChains.length > 0 && (
                        <ActionButton auto ghost scale={1} onClick={toggleNetworks}>
                          {showNetworks ? 'Hide Networks' : 'Network Settings'}
                        </ActionButton>
                      )}
                    </div>
                    {showNetworks && switchableChains.length > 0 && (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {switchableChains.map((chain) => (
                          <ActionButton
                            key={chain.id}
                            auto
                            scale={1}
                            onClick={() => handleSwitchChain(chain.id)}
                            disabled={isSwitching}
                            type={chain.id === chainId ? 'success' : 'secondary'}
                          >
                            {chain.name}
                          </ActionButton>
                        ))}
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-2xl mx-auto px-2">
              <Card shadow width="100%">
                <Card.Content className="px-4 sm:px-6">
                  <div className="flex flex-col gap-6 max-w-xl mx-auto">
                    <div className="flex items-center gap-4 justify-center">
                      <Wallet className="w-10 h-10 text-base-blue" />
                      <div className="text-left">
                        <Text h3 className="mb-0">Connect your wallet</Text>
                        <Text small type="secondary">
                          Securely authenticate with Base in seconds.
                        </Text>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      {readyConnectors.map((connector) => {
                        const connectorId = connectorIdentifier(connector);
                        const isPending = isConnecting && selectedConnectorId === connectorId;
                        return (
                          <ActionButton
                            key={connectorId}
                            auto
                            scale={1}
                            className="w-full"
                            disabled={!connector.ready || isPending}
                            onClick={() => handleConnect(connector)}
                          >
                            {isPending ? (
                              <span className="flex items-center gap-2 justify-center">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Connecting to {connector.name}...
                              </span>
                            ) : (
                              `Connect with ${connector.name}`
                            )}
                          </ActionButton>
                        );
                      })}
                    </div>
                    <Text small type="secondary">
                      💡 Works with WalletConnect, MetaMask, Coinbase Wallet and more.
                    </Text>
                    {connectError && (
                      <div className="bg-error/10 border border-error/20 rounded-xl p-3 flex items-center gap-2 text-error">
                        <AlertCircle className="w-4 h-4" />
                        <Text small type="error">
                          {connectError.message}
                        </Text>
                      </div>
                    )}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Spacer h={1} />
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <ActionButton
          auto
          ghost
          icon={<ExternalLink size={16} />}
          disabled={wcLoading}
          onClick={handleWalletConnect}
        >
          {wcLoading ? 'Opening WalletConnect…' : 'WalletConnect QR'}
        </ActionButton>
      </div>
      {wcError && (
        <div className="mt-4 flex items-center justify-center gap-2 text-error">
          <AlertCircle className="w-4 h-4" />
          <Text small type="error">
            {wcError}
          </Text>
        </div>
      )}
    </motion.div>
  );
};

export default Hero;
