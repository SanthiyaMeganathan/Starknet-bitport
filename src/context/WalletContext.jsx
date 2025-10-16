// src/context/WalletContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { 
  connectWallet as xverseConnect, 
  disconnectWallet as xverseDisconnect,
  isWalletInstalled 
} from '../services/xverseService';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [accountsList, setAccountsList] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Check if wallet is installed on mount
  useEffect(() => {
    const checkWallet = () => {
      if (!isWalletInstalled()) {
        console.warn('Xverse wallet not installed');
      }
    };
    checkWallet();
  }, []);

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const { currentAccount, accountsList: accounts } = await xverseConnect();
      
      setActiveAccount(currentAccount);
      setAccountsList(accounts);
      setWalletConnected(true);
      
      console.log('✅ Wallet connected in context:', currentAccount);
      return { currentAccount, accountsList: accounts };
    } catch (err) {
      console.error('❌ Context wallet connect error:', err);
      setError(err.message);
      setWalletConnected(false);
      setActiveAccount(null);
      setAccountsList([]);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch account function
  const switchAccount = async (index) => {
    if (!accountsList || accountsList.length === 0) {
      throw new Error('No accounts available');
    }
    
    if (index < 0 || index >= accountsList.length) {
      throw new Error('Invalid account index');
    }

    const account = accountsList[index];
    setActiveAccount(account);
    
    console.log('Switched to account:', account);
    return account;
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    xverseDisconnect();
    setWalletConnected(false);
    setActiveAccount(null);
    setAccountsList([]);
    setError(null);
    console.log('Wallet disconnected from context');
  };

  const value = {
    walletConnected,
    activeAccount,
    accountsList,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchAccount,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};