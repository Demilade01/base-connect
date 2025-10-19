import React, { createContext, useContext, useState } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  switchChain: (chainId: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate wallet connection for demo purposes
      // In a real implementation, this would integrate with WalletConnect
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Demo wallet data
      const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
      const demoChainId = 8453; // Base Mainnet
      const demoBalance = '1.2345';

      setIsConnected(true);
      setAddress(demoAddress);
      setChainId(demoChainId);
      setBalance(demoBalance);

    } catch (err) {
      setError('Failed to connect wallet');
      console.error('Connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      setIsConnected(false);
      setAddress(null);
      setChainId(null);
      setBalance(null);
      setError(null);
    } catch (err) {
      setError('Failed to disconnect wallet');
      console.error('Disconnect error:', err);
    }
  };

  const switchChain = async (newChainId: number) => {
    try {
      setChainId(newChainId);
      // In a real implementation, this would switch the network
    } catch (err) {
      setError('Failed to switch network');
      console.error('Switch chain error:', err);
    }
  };

  const contextValue: WalletContextType = {
    isConnected,
    address,
    chainId,
    balance,
    isLoading,
    error,
    connect,
    disconnect,
    switchChain,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};