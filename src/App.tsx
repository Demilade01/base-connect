
import Layout from './components/Layout';
import Hero from './components/Hero';
import Features from './components/Features';
import WalletInfo from './components/WalletInfo';
import { WalletProvider } from './contexts/WalletContext';

function App() {
  return (
    <WalletProvider>
      <Layout>
        <Hero />
        <WalletInfo />
        <Features />
      </Layout>
    </WalletProvider>
  );
}

export default App;
