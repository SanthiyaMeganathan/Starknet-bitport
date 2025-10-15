import { request, AddressPurpose, RpcErrorCode } from 'sats-connect';

let currentAccount = null;

// -------------------------
// 1. Connect Wallet
// -------------------------
export const connectWallet = async () => {
  try {
    // Request read access permissions
    const perm = await request('wallet_requestPermissions');
    if (perm.status === 'error') throw new Error('Permission denied');

    // Fetch user's Bitcoin addresses
    const response = await request('getAddresses', { purposes: ['payment', 'ordinals'] });
    if (response.status !== 'success') throw new Error('Failed to fetch addresses');

    const paymentAddress = response.result.find(addr => addr.purpose === AddressPurpose.Payment);
    const ordinalsAddress = response.result.find(addr => addr.purpose === AddressPurpose.Ordinals);

    if (!paymentAddress) throw new Error('Payment address not found');

    currentAccount = {
      name: 'Xverse Wallet',
      address: paymentAddress.address,
      ordinalsAddress: ordinalsAddress?.address || null,
    };

    return { currentAccount };
  } catch (err) {
    console.error('Wallet connect error:', err);
    throw err;
  }
};

// -------------------------
// 2. Switch Account
// -------------------------
export const switchAccount = (account) => {
  if (!account) throw new Error('Account required');
  currentAccount = account;
  return currentAccount;
};

// -------------------------
// 3. Get BTC Balance
// -------------------------
export const getBTCBalance = async () => {
  if (!currentAccount) throw new Error('Wallet not connected');
  try {
    const balanceRes = await request('getBalance');
    if (balanceRes.status !== 'success') throw new Error('Failed to fetch balance');

    return balanceRes.result.total || '0';
  } catch (err) {
    console.error('Error fetching BTC balance:', err);
    return '0';
  }
};

// -------------------------
// 4. Send BTC
// -------------------------
export const sendBTC = async (recipients) => {
  if (!currentAccount) throw new Error('Wallet not connected');
  try {
    const tx = await request('sendTransfer', { recipients });
    if (tx.status !== 'success') throw new Error('Send transfer failed');
    return tx.result.txid;
  } catch (err) {
    console.error('Error sending BTC:', err);
    throw err;
  }
};

export const bridgeBTCToStarknet = async (amountBTC) => {
    // your code here
};
