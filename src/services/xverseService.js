// src/services/xverseService.js
import { request, AddressPurpose } from 'sats-connect';

let currentAccount = null;
let accountsList = [];

// -------------------------
// 1. Connect Wallet (Fixed)
// -------------------------
export const connectWallet = async () => {
  try {
    // Check if Xverse is installed
    if (!window.XverseProviders?.BitcoinProvider) {
      throw new Error('Xverse Wallet not detected. Please install the Xverse extension.');
    }

    const btcProvider = window.XverseProviders.BitcoinProvider;

    // Request connection with proper parameters
    const response = await btcProvider.request('getAccounts', {
      purposes: ['payment', 'ordinals'],
      message: 'Connect your Xverse wallet to BitBuddy',
    });

    console.log('🟢 Xverse connection response:', response);

    // Handle the response safely
    if (!response || !response.result) {
      throw new Error('No response from wallet');
    }

    // Extract addresses from the result
    const addresses = response.result;
    
    if (!Array.isArray(addresses) || addresses.length === 0) {
      throw new Error('No addresses found in wallet response');
    }

    // Find payment address
    const paymentAddr = addresses.find(addr => addr.purpose === 'payment');
    
    if (!paymentAddr) {
      throw new Error('No payment address found');
    }

    // Map to your account format
    accountsList = [{
      name: 'Xverse Wallet',
      address: paymentAddr.address,
      publicKey: paymentAddr.publicKey || '',
      purpose: paymentAddr.purpose
    }];

    currentAccount = accountsList[0];
    
    console.log('✅ Wallet connected successfully:', currentAccount);
    return { currentAccount, accountsList };

  } catch (err) {
    console.error('❌ Wallet connect error:', err);
    
    // Provide user-friendly error messages
    if (err.message.includes('User rejected')) {
      throw new Error('Connection rejected. Please approve the connection in your Xverse wallet.');
    } else if (err.message.includes('not detected')) {
      throw err;
    } else {
      throw new Error('Failed to connect wallet. Please try again.');
    }
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

    currentAccount = accountsList[accountIndex];
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
    const btcProvider = window.XverseProviders.BitcoinProvider;
    
    const balanceResponse = await btcProvider.request('getBalance', {
      address: currentAccount.address,
    });

    console.log('Balance response:', balanceResponse);

    if (balanceResponse && balanceResponse.result) {
      // Convert satoshis to BTC (1 BTC = 100,000,000 satoshis)
      const balanceInSats = balanceResponse.result.confirmed || 0;
      const balanceInBTC = (balanceInSats / 100000000).toFixed(8);
      return balanceInBTC;
    }

    return '0';
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
    const btcProvider = window.XverseProviders.BitcoinProvider;
    
    // Convert BTC to satoshis
    const amountInSats = Math.floor(parseFloat(amountBTC) * 100000000);

    const tx = await btcProvider.request('sendTransfer', {
      recipients: [
        {
          address: recipientAddress,
          amount: amountInSats,
        }
      ],
      senderAddress: currentAccount.address,
      message: memo,
    });

    console.log('BTC sent:', tx);
    return tx;
  } catch (err) {
    console.error('Error sending BTC:', err);
    throw err;
  }
};

// -------------------------
// 5. Bridge BTC to Starknet (Placeholder)
// -------------------------
export const bridgeBTCToStarknet = async (amountBTC) => {
  if (!currentAccount) throw new Error('Wallet not connected');
  
  // Note: This is a placeholder. Actual bridging requires integration with a bridge protocol
  console.warn('Bridge functionality not yet implemented');
  throw new Error('Bridge functionality coming soon');
};

// -------------------------
// 6. Get Transaction History
// -------------------------
export const getTxHistory = async () => {
  if (!currentAccount) throw new Error('Wallet not connected');
  
  try {
    const btcProvider = window.XverseProviders.BitcoinProvider;
    
    const historyResponse = await btcProvider.request('getTransactions', {
      address: currentAccount.address,
    });

    if (historyResponse && historyResponse.result) {
      return historyResponse.result;
    }

    return [];
  } catch (err) {
    console.error('Error fetching transactions:', err);
    return [];
  }
};

// -------------------------
// 7. Disconnect Wallet
// -------------------------
export const disconnectWallet = () => {
  currentAccount = null;
  accountsList = [];
  console.log('Wallet disconnected');
};

// -------------------------
// 8. Get Current Account
// -------------------------
export const getCurrentAccount = () => {
  return currentAccount;
};

// -------------------------
// 9. Check if Wallet is Installed
// -------------------------
export const isWalletInstalled = () => {
  return !!window.XverseProviders?.BitcoinProvider;
};