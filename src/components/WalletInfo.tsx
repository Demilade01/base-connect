import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Button, Card, Grid, Spacer, Text, Snippet, Tag } from '@geist-ui/core';
import { useAccount, useBalance, useChainId } from 'wagmi';
import {
  Wallet,
  Copy,
  ExternalLink,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Network,
  Coins,
} from 'lucide-react';
import { formatEther } from 'viem';

const ActionButton = Button as React.ComponentType<any>;

const WalletInfo: React.FC = () => {
  const { address, status } = useAccount();
  const chainId = useChainId();
  const { data, refetch, isFetching, isLoading, error } = useBalance({
    address,
    query: {
      enabled: Boolean(address),
      refetchInterval: 30_000,
    },
  });
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    );
  }, []);

  const copyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const refreshBalance = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const openExplorer = () => {
    if (!address || !chainId) return;
    const explorerUrl =
      chainId === 8453
        ? `https://basescan.org/address/${address}`
        : `https://sepolia.basescan.org/address/${address}`;
    window.open(explorerUrl, '_blank');
  };

  const getNetworkName = () => {
    switch (chainId) {
      case 8453:
        return 'Base Mainnet';
      case 84532:
        return 'Base Sepolia';
      default:
        return 'Unknown Network';
    }
  };

  const balanceDisplay = data ? `${Number(formatEther(data.value)).toFixed(4)} ${data.symbol}` : '--';
  const loadingSkeleton = status === 'connecting' || (isLoading && !address);
  const balanceError = error instanceof Error ? error.message : null;

  if (loadingSkeleton) {
    return (
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-3 bg-neutral-200 rounded w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-24 bg-neutral-100 rounded-xl" />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (!address) {
    return (
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-200 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Wallet className="w-10 h-10 text-base-blue" />
          <div className="text-left">
            <Text h4 className="mb-0">
              Connect your wallet to continue
            </Text>
            <Text small type="secondary">
              Your address, network, and balances will appear here.
            </Text>
          </div>
        </div>
        <AnimatePresence>
          {balanceError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-error" />
              <Text small type="error">
                {balanceError}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card shadow width="100%">
        <Card.Content>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-base-blue to-base-dark-blue rounded-full flex items-center justify-center shadow-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <Text h3 className="mb-0">
                Wallet Overview
              </Text>
              <Text small type="secondary">
                Everything you need to know about your Base session.
              </Text>
            </div>
          </div>

          <Grid.Container gap={2}>
            <Grid xs={24} md={12}>
              <div className="w-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                <Text small type="secondary" className="flex items-center gap-2 mb-1">
                  <Wallet className="w-4 h-4" />
                  Wallet Address
                </Text>
            <Snippet symbol="" width="100%" className="mb-3" text={address ?? ''}>
                  {address}
                </Snippet>
                <div className="flex gap-2">
                  <ActionButton
                    auto
                    scale={0.8}
                    onClick={copyAddress}
                    icon={copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </ActionButton>
                  <ActionButton
                    auto
                    scale={0.8}
                    icon={<ExternalLink size={16} />}
                    onClick={openExplorer}
                  >
                    Explorer
                  </ActionButton>
                </div>
              </div>
            </Grid>

            <Grid xs={24} md={12}>
              <div className="w-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                <Text small type="secondary" className="flex items-center gap-2 mb-1">
                  <Network className="w-4 h-4" />
                  Network
                </Text>
                <div className="flex items-center justify-between">
                  <div>
                    <Text className="font-semibold mb-1">{getNetworkName()}</Text>
                    <Tag type={chainId === 8453 ? 'success' : 'warning'} invert>
                      Chain ID: {chainId ?? '—'}
                    </Tag>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid xs={24} md={12}>
              <div className="w-full bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700">
                <Text small type="secondary" className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4" />
                  Balance
                </Text>
                <div className="flex items-center justify-between">
                  <div>
                    <Text h3 className="mb-0">
                      {balanceDisplay}
                    </Text>
                    <Text small type="secondary">
                      Updated automatically every 30 seconds
                    </Text>
                  </div>
                  <ActionButton
                    auto
                    scale={0.8}
                    icon={<RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />}
                    loading={refreshing || isFetching}
                    onClick={refreshBalance}
                    type="secondary"
                  >
                    Refresh
                  </ActionButton>
                </div>
              </div>
            </Grid>
          </Grid.Container>

          <Spacer h={0.5} />
          <AnimatePresence>
            {balanceError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-error/10 border border-error/20 rounded-xl p-4 mt-4 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-error" />
                <Text small type="error">
                  {balanceError}
                </Text>
              </motion.div>
            )}
          </AnimatePresence>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default WalletInfo;
