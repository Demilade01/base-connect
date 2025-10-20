import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { createAppKit } from '@reown/appkit';
import { defineChain } from '@reown/appkit/networks';

// Global flag to prevent multiple WalletConnect initializations
let isWalletConnectInitialized = false;

// Define Base networks
const baseMainnet = defineChain({
  id: 8453,
  name: 'Base',
  chainNamespace: 'eip155' as const,
  caipNetworkId: 'eip155:8453',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://mainnet.base.org'] },
    public: { http: ['https://mainnet.base.org'] }
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' }
  },
  testnet: false
});

export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  chainNamespace: 'eip155',
  caipNetworkId: 'eip155:84532',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BaseScan (Sepolia)',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
});

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
  const [appKit, setAppKit] = useState<any>(null);
  const initializationRef = useRef(false);

  // Ensure we start in disconnected state
  useEffect(() => {
    setIsConnected(false);
    setAddress(null);
    setChainId(null);
    setBalance(null);
  }, []);

  // Fetch wallet balance
  const fetchBalance = async (walletAddress: string, networkChainId: number) => {
    try {
      // Use more reliable RPC endpoints
      const rpcUrl =
        networkChainId === 8453
          ? "https://mainnet.base.org"
          : "https://base-sepolia-rpc.publicnode.com";

      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
          id: 1,
        }),
      });

      const data = await response.json();
      if (data.result) {
        const balanceWei = parseInt(data.result, 16);
        const balanceEth = balanceWei / Math.pow(10, 18);
        setBalance(balanceEth.toFixed(6));
      }
    } catch (err) {
      console.error("Failed to fetch balance:", err);
      // Set a fallback balance instead of 0
      setBalance("0.000000");
    }
  };

  // Initialize AppKit
  useEffect(() => {
    if (initializationRef.current || isWalletConnectInitialized) return; // Prevent multiple initializations

    const initializeAppKit = async () => {
      try {
        initializationRef.current = true; // Mark as initializing
        isWalletConnectInitialized = true; // Global flag
        const kit = createAppKit({
          projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
          networks: [baseMainnet, baseSepolia],
          metadata: {
            name: "BaseConnect",
            description: "Connect your wallet to Base network",
            url: window.location.origin,
            icons: [`${window.location.origin}/vite.svg`],
          },
          features: {
            analytics: true,
            email: false,
            socials: ['google', 'x', 'discord'],
          },
        });

        setAppKit(kit);

        // Listen for connection events
        kit.subscribeAccount((account: any) => {
          if (account) {
            setIsConnected(true);
            setAddress(account.address);
            setChainId(account.chainId);
            fetchBalance(account.address, account.chainId);
          } else {
            setIsConnected(false);
            setAddress(null);
            setChainId(null);
            setBalance(null);
          }
        });

      } catch (err) {
        console.error("Failed to initialize AppKit:", err);
        setError("Failed to initialize wallet connection");
        // Reset flags on error to allow retry
        initializationRef.current = false;
        isWalletConnectInitialized = false;
      }
    };

    initializeAppKit();

    // Cleanup function
    return () => {
      if (appKit) {
        // Clean up any subscriptions if needed
        // Reset global flag on cleanup
        isWalletConnectInitialized = false;
      }
    };
  }, []); // Remove address dependency to prevent re-initialization

  const connect = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!appKit) {
        throw new Error("AppKit not initialized");
      }

      // Open AppKit modal
      await appKit.open();

    } catch (err) {
      console.error("Connection error:", err);
      setError("Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      if (appKit) {
        await appKit.disconnect();
      }
      setIsConnected(false);
      setAddress(null);
      setChainId(null);
      setBalance(null);
      setError(null);
    } catch (err) {
      console.error("Disconnect error:", err);
      setError("Failed to disconnect wallet");
    }
  };

  const switchChain = async (newChainId: number) => {
    try {
      if (appKit) {
        await appKit.switchChain({ chainId: newChainId });
      }
      setChainId(newChainId);
      if (address) await fetchBalance(address, newChainId);
    } catch (err) {
      console.error("Switch chain error:", err);
      setError("Failed to switch network");
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
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};