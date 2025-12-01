import { Core } from '@walletconnect/core';
import EthereumProvider from '@walletconnect/ethereum-provider';
import { Web3Wallet } from '@walletconnect/web3wallet';
import { base, baseSepolia } from 'wagmi/chains';

type SessionListener = (address: string | null) => void;

const metadata = {
  name: 'BaseConnect',
  description: 'Connect your wallet to the Base network',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://base.org',
  icons: ['https://walletconnect.com/walletconnect-logo.png'],
};

type Web3WalletClient = Awaited<ReturnType<typeof Web3Wallet.init>>;
type WalletConnectCore = InstanceType<typeof Core>;

class WalletConnectService {
  private providerPromise: Promise<EthereumProvider> | null = null;
  private web3WalletPromise: Promise<Web3WalletClient> | null = null;
  private listeners = new Set<SessionListener>();
  private projectId =
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '00000000000000000000000000000000';
  private coreInstance: WalletConnectCore | null = null;

  private getCore(): WalletConnectCore {
    if (!this.coreInstance) {
      this.coreInstance = new Core({ projectId: this.projectId });
    }
    return this.coreInstance;
  }

  private async ensureProvider() {
    if (!this.providerPromise) {
      this.providerPromise = EthereumProvider.init({
        projectId: this.projectId,
        chains: [base.id],
        optionalChains: [baseSepolia.id],
        showQrModal: true,
        metadata,
      }).then((provider) => {
        provider.on('session_delete', () => this.emit(null));
        provider.on('accountsChanged', (accounts: string[]) => {
          this.emit(accounts[0] ?? null);
        });
        return provider;
      });
    }

    return this.providerPromise;
  }

  async connectWithQrModal() {
    const provider = await this.ensureProvider();
    await provider.connect();
    const accounts = (await provider.request({ method: 'eth_accounts' })) as string[];
    this.emit(accounts[0] ?? null);
    return provider;
  }

  async disconnect() {
    const provider = this.providerPromise ? await this.providerPromise : null;
    if (provider) {
      await provider.disconnect();
    }
    this.providerPromise = null;
    this.emit(null);
  }

  async getWeb3Wallet() {
    if (!this.web3WalletPromise) {
      this.web3WalletPromise = Web3Wallet.init({
        metadata,
        core: this.getCore() as unknown as Parameters<typeof Web3Wallet.init>[0]['core'],
      });
    }
    return this.web3WalletPromise;
  }

  subscribe(listener: SessionListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(address: string | null) {
    this.listeners.forEach((listener) => listener(address));
  }
}

export const walletConnectService = new WalletConnectService();

