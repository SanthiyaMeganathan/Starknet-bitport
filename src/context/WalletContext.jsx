// src/context/WalletContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { request, AddressPurpose } from 'sats-connect';

// Create the Wallet Context
export const WalletContext = createContext();

// Provider Component
export const WalletProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [accountsList, setAccountsList] = useState([]);

  // -------------------------
  // 1. Connect Wallet
  // -------------------------
  const connectWallet = async () => {
    try {
      // Use XverseProviders if available
      if (window.XverseProviders?.BitcoinProvider) {
        const btcProvider = window.XverseProviders.BitcoinProvider;

        const response = await btcProvider.connect({
          network: { type: 'Testnet' }, // or 'Mainnet'
          message: 'Connect your Xverse wallet to this app',
        });

        const accounts = response.addresses.map(addr => ({
          name: 'Xverse Wallet',
          address: addr.address,
        }));

        setAccountsList(accounts);
        setActiveAccount(accounts[0] || null);
        setWalletConnected(accounts.length > 0);

        console.log('✅ Wallet connected via XverseProviders:', accounts);
        return { currentAccount: accounts[0], accountsList: accounts };
      }

      // Fallback to legacy sats-connect
      if (!window.xverse) {
        throw new Error('Xverse Wallet not detected. Please install it.');
      }

      const legacyResponse = await request('wallet_connect', {
        addresses: ['payment'],
        message: 'Connect your wallet to our app',
        network: 'testnet',
      });

      if (legacyResponse.status !== 'success') {
        throw new Error('Wallet connection failed');
      }

      const paymentAddress = legacyResponse.result.addresses.find(
        addr => addr.purpose === AddressPurpose.Payment
      );

      const accounts = [{ name: 'Xverse Wallet', address: paymentAddress.address }];
      setAccountsList(accounts);
      setActiveAccount(accounts[0]);
      setWalletConnected(true);

      console.log('✅ Wallet connected via legacy sats-connect:', accounts[0]);
      return { currentAccount: accounts[0], accountsList: accounts };
    } catch (err) {
      console.error('❌ Wallet connect error:', err);
      setWalletConnected(false);
      setActiveAccount(null);
      setAccountsList([]);
      throw err;
    }
  };

  // -------------------------
  // 2. Switch Account
  // -------------------------
  const switchAccount = async (index) => {
    if (!accountsList || accountsList.length === 0) {
      throw new Error('No accounts available to switch');
    }
    if (index < 0 || index >= accountsList.length) {
      throw new Error('Invalid account index');
    }

    const account = accountsList[index];
    setActiveAccount(account);

    // Optional: notify XverseProvider if supported
    if (window.XverseProviders?.BitcoinProvider?.request) {
      try {
        await window.XverseProviders.BitcoinProvider.request({
          method: 'wallet_switchAccount',
          params: { address: account.address },
        });
      } catch (err) {
        console.warn('Wallet switch request failed (may not be supported):', err);
      }
    }

    console.log('Switched to account:', account);
    return account;
  };

  // -------------------------
  // 3. Disconnect Wallet
  // -------------------------
  const disconnectWallet = () => {
    setWalletConnected(false);
    setActiveAccount(null);
    setAccountsList([]);
  };

  // -------------------------
  // 4. Auto-detect account changes (if Xverse supports events)
  // -------------------------
  useEffect(() => {
    if (window.XverseProviders?.BitcoinProvider?.on) {
      const handleAccountsChanged = async () => {
        try {
          const response = await window.XverseProviders.BitcoinProvider.request({
            method: 'getAccounts',
          });

          const accounts = response?.addresses?.map(addr => ({
            name: 'Xverse Wallet',
            address: addr.address,
          })) || [];

          setAccountsList(accounts);
          setActiveAccount(accounts[0] || null);
          setWalletConnected(accounts.length > 0);
        } catch (err) {
          console.error('Failed to refresh accounts:', err);
        }
      };

      window.XverseProviders.BitcoinProvider.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.XverseProviders.BitcoinProvider?.removeListener?.('accountsChanged', handleAccountsChanged);
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
