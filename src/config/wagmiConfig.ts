import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from 'wagmi/connectors';

const appName = 'BaseConnect';
const projectId =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000';
const baseRpcUrl = import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org';
const baseSepoliaRpcUrl =
  import.meta.env.VITE_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';

export const chains = [base, baseSepolia] as const;

export const wagmiConfig = createConfig({
  chains,
  connectors: [
    walletConnect({ projectId, showQrModal: false }),
    metaMask({
      dappMetadata: {
        name: appName,
      },
    }),
    coinbaseWallet({ appName }),
    injected(),
  ],
  transports: {
    [base.id]: http(baseRpcUrl),
    [baseSepolia.id]: http(baseSepoliaRpcUrl),
  },
  ssr: false,
});

