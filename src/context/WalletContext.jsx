// src/context/WalletContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { request, AddressPurpose, getProviders } from 'sats-connect';

// Create the Wallet Context
export const WalletContext = createContext();

// Provider Component
export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [accountsList, setAccountsList] = useState([]);

  // Connect to wallet
  const connectWallet = async () => {

    try {
        const acts = await request({ method: 'connect' });
        console.log(accounts);
        StacksProvider.request("stx_getAccounts")
      if (!window.xverse) {
        
        
        throw new Error('Xverse Wallet not detected. Please install it.');
      }

      const response = await request('getAddresses', {
        purposes: ['payment', 'ordinals'],
        message: 'Connect your wallet to our app',
      });

      if (response.status !== 'success') {
        throw new Error('Wallet connection failed');
      }

      // Extract accounts
      const accounts = response.result.map(addr => ({
        address: addr.address,
        purpose: addr.purpose,
        addressType: addr.addressType,
      }));

      setAccountsList(accounts);

      // Set active account as the first payment address
      const paymentAccount = accounts.find(a => a.purpose === 'payment');
      setActiveAccount(paymentAccount || accounts[0]);
      setWalletConnected(true);

      return paymentAccount;
    } catch (err) {
      console.error('Wallet connection error:', err);
      setWalletConnected(false);
      setActiveAccount(null);
      throw err;
    }
  };

  // Switch active account (from legacy modal or dropdown)
  const switchAccount = (account) => {
    setActiveAccount(account);
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletConnected(false);
    setActiveAccount(null);
    setAccountsList([]);
  };

  // Auto-detect account changes if Xverse supports events
  useEffect(() => {
    if (window.xverse?.on) {
      const handleAccountsChanged = async () => {
        try {
          const response = await request('getAddresses', {
            purposes: ['payment', 'ordinals'],
          });
          if (response.status === 'success') {
            const accounts = response.result.map(addr => ({
              address: addr.address,
              purpose: addr.purpose,
              addressType: addr.addressType,
            }));
            setAccountsList(accounts);
            const paymentAccount = accounts.find(a => a.purpose === 'payment');
            setActiveAccount(paymentAccount || accounts[0]);
          }
        } catch (err) {
          console.error('Failed to refresh accounts:', err);
        }
      };

      window.xverse.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.xverse?.removeListener?.('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletConnected,
        activeAccount,
        accountsList,
        connectWallet,
        disconnectWallet,
        switchAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
