# 🧩 BaseConnect

A modern, lightweight dApp that enables seamless wallet connection to the Base blockchain using WalletConnect. Built with React, TypeScript, and beautiful animations.

![BaseConnect Banner](https://img.shields.io/badge/Base-0052FF?style=for-the-badge&logo=base&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![WalletConnect](https://img.shields.io/badge/WalletConnect-3B99FC?style=for-the-badge&logo=walletconnect&logoColor=white)

## ✨ Features

🔗 **Wallet Connection**: Connect via WalletConnect (QR code or mobile deep link)
💼 **Address Display**: Show connected wallet address in a clean, shortened format
💰 **Balance Display**: Real-time ETH balance on Base network
🌐 **Network Info**: Display current network (Base Mainnet/Sepolia)
🔒 **Secure Disconnect**: Safe wallet disconnection
🎨 **Smooth Animations**: Beautiful transitions powered by Framer Motion & GSAP
📱 **Mobile Optimized**: Perfect for mobile wallet connections

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A crypto wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd base-con

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
# Base Network RPC (choose one)
VITE_BASE_RPC_URL=https://mainnet.base.org
# or for testing: https://sepolia.base.org

# Optional: Alchemy API Key for enhanced features
VITE_ALCHEMY_API_KEY=your_alchemy_key_here

# Optional: WalletConnect Project ID
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## 🛠️ Tech Stack

### Core Framework
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool

### Blockchain Integration
- **@reown/walletkit** - Modern WalletConnect implementation
- **@walletconnect/core** - Core wallet connection functionality
- **Base Network** - Layer 2 blockchain integration

### UI & Animations
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - React animation library
- **GSAP** - Professional-grade animations
- **Lottie React** - Complex vector animations

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Vite** - Development server & bundling

## 🎯 Base Network Support

BaseConnect supports both Base networks:

- **Base Mainnet** - Production environment
- **Base Sepolia** - Test network for development

Switch between networks seamlessly with automatic detection and user-friendly indicators.

## 📱 Mobile Experience

Optimized for mobile wallet connections:
- QR code scanning
- Deep link support
- Touch-friendly interface
- Responsive design

## 🎨 Animation Features

- **Wallet Connection**: Smooth loading states and success animations
- **Balance Display**: Number counting animations
- **Network Switching**: Color-coded transitions
- **Loading States**: Elegant skeleton screens
- **Micro-interactions**: Hover effects and button animations

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Base L2 infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 WCT Builder Rewards

This project actively uses WalletConnect infrastructure and qualifies for WCT Builder Rewards. Learn more at [WalletConnect Builder Program](https://walletconnect.com/builder-program).

## 🔗 Links

- [Base Network](https://base.org)
- [WalletConnect](https://walletconnect.com)
- [Base Documentation](https://docs.base.org)
- [React Documentation](https://react.dev)

---

Built with ❤️ for the Base ecosystem
