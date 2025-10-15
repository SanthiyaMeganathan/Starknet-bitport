// src/services/xverseService.js
import { request, AddressPurpose } from 'sats-connect';

let currentAccount = null;
let accountsList = []; // store multiple addresses

// -------------------------
// 1. Connect Wallet
// -------------------------
export const connectWallet = async () => {
  try {
    // Use XverseProviders if available
    if (window.XverseProviders?.BitcoinProvider) {
      const btcProvider = window.XverseProviders.BitcoinProvider;

      // Trigger wallet connection
      const response = await btcProvider.connect({
        network: {
          type: 'Testnet', // or 'Mainnet'
        },
        message: 'Connect your Xverse wallet to this app',
      });

      console.log('✅ Wallet connected via XverseProviders:', response);

      accountsList = response.addresses.map((addr) => ({
        name: 'Xverse Wallet',
        address: addr.address,
      }));

      currentAccount = accountsList[0]; // default to first account
      return { currentAccount, accountsList };
    }

    // Fallback to legacy sats-connect method
    if (!window.xverse) {
      throw new Error('Xverse Wallet not detected. Please install it.');
    }

    const legacyResponse = await request('wallet_connect', {
      addresses: ['payment'],
      message: 'Connect your wallet to our app',
      network: 'testnet',
    });

    if (legacyResponse.status !== 'success') {
      throw new Error('Connection failed');
    }

    const paymentAddress = legacyResponse.result.addresses.find(
      (addr) => addr.purpose === AddressPurpose.Payment
    );

    if (!paymentAddress) {
      throw new Error('Payment address not found');
    }

    currentAccount = {
      name: 'Xverse Wallet',
      address: paymentAddress.address,
    };
    accountsList = [currentAccount];

    console.log('✅ Wallet connected via legacy sats-connect:', currentAccount);
    return { currentAccount, accountsList };
  } catch (err) {
    console.error('❌ Wallet connect error:', err);
    throw err;
  }
};

// -------------------------
// 2. Switch Account
// -------------------------
export const switchAccount = async (accountIndex) => {
  try {
    if (!accountsList || accountsList.length === 0) {
      throw new Error('No accounts available to switch');
    }

    if (accountIndex < 0 || accountIndex >= accountsList.length) {
      throw new Error('Invalid account index');
    }

    // Update current account
    currentAccount = accountsList[accountIndex];

    // Optional: trigger wallet provider to switch (if supported)
    if (window.XverseProviders?.BitcoinProvider?.request) {
      await window.XverseProviders.BitcoinProvider.request({
        method: 'wallet_switchAccount',
        params: { address: currentAccount.address },
      }).catch((err) => {
        console.warn('Wallet switch request failed (may not be supported):', err);
      });
    }

    console.log('Switched to account:', currentAccount);
    return currentAccount;
  } catch (err) {
    console.error('Error switching account:', err);
    throw err;
  }
};

// -------------------------
// 3. Get BTC Balance
// -------------------------
export const getBTCBalance = async () => {
  if (!currentAccount) throw new Error('Wallet not connected');
  try {
    const balanceResponse = await request('getBalance', {
      address: currentAccount.address,
      asset: 'BTC',
    });

    if (balanceResponse.status !== 'success') {
      throw new Error('Failed to fetch balance');
    }

    return balanceResponse.result.total || '0';
  } catch (err) {
    console.error('Error fetching BTC balance:', err);
    return '0';
  }
};

// -------------------------
// 4. Send BTC
// -------------------------
export const sendBTC = async (recipientAddress, amountBTC, memo = '') => {
  if (!currentAccount) throw new Error('Wallet not connected');
  try {
    const tx = await request('sendTransfer', {
      from: currentAccount.address,
      to: recipientAddress,
      amount: amountBTC,
      memo,
    });
    console.log('BTC sent:', tx);
    return tx;
  } catch (err) {
    console.error('Error sending BTC:', err);
    throw err;
  }
};

// -------------------------
// 5. Bridge BTC to Starknet
// -------------------------
export const bridgeBTCToStarknet = async (amountBTC) => {
  if (!currentAccount) throw new Error('Wallet not connected');
  try {
    const tx = await request('sendTransfer', {
      from: currentAccount.address,
      to: 'starknet-bridge-address',
      amount: amountBTC,
      memo: 'Bridge BTC to Starknet',
    });
    console.log('Bridged BTC to Starknet:', tx);
    return tx;
  } catch (err) {
    console.error('Error bridging BTC:', err);
    throw err;
  }
};

// -------------------------
// 6. Get Transaction History
// -------------------------
export const getTxHistory = async () => {
  if (!currentAccount) throw new Error('Wallet not connected');
  try {
    const historyResponse = await request('getTransactions', {
      address: currentAccount.address,
    });

    if (historyResponse.status !== 'success') {
      throw new Error('Failed to fetch transaction history');
    }

    return historyResponse.result.transactions || [];
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return [];
  }
};
