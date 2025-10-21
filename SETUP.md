# BaseConnect Setup Guide

## WalletConnect Configuration

To use this application, you need to configure a WalletConnect Project ID:

1. Go to [WalletConnect Cloud](https://cloud.reown.com/)
2. Create a new project or use an existing one
3. Copy your Project ID
4. Update the `.env` file with your actual Project ID:

```env
VITE_WALLETCONNECT_PROJECT_ID=your_actual_project_id_here
```

## Features

- ✅ Proper wallet detection and connection state
- ✅ Base Mainnet and Sepolia testnet support
- ✅ Real-time balance fetching
- ✅ Network switching
- ✅ Error handling and user feedback
- ✅ Modern UI with animations

## Troubleshooting

If you see "WalletConnect Project ID not configured" error:
1. Make sure you have a `.env` file in the root directory
2. Set the correct `VITE_WALLETCONNECT_PROJECT_ID` value
3. Restart the development server

The app will now properly show:
- "Connect Your Wallet" when no wallet is connected
- "Wallet Connected!" only when a wallet is actually connected
- Proper error messages for configuration issues

