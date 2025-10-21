
import Layout from './components/Layout';
import Hero from './components/Hero';
import Features from './components/Features';
import WalletInfo from './components/WalletInfo';
import { WalletProvider } from './contexts/WalletContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
        <Layout>
          <Hero />
          <WalletInfo />
          <Features />
        </Layout>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
