// src/routes/WalletPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/wallet.css';
import { WalletContext } from '../context/WalletContext';
import { getBTCBalance } from '../services/xverseService';
import { convertBTCToUSD } from '../services/coingeckoService';

const WalletPage = () => {
  const navigate = useNavigate();
  const { 
    walletConnected, 
    activeAccount, 
    accountsList, 
    connectWallet, 
    disconnectWallet,
    switchAccount,
    isConnecting,
    error 
  } = useContext(WalletContext);

  const [balance, setBalance] = useState("0");
  const [balanceUSD, setBalanceUSD] = useState("0.00");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Fetch balance when wallet is connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (walletConnected && activeAccount) {
        setLoading(true);
        try {
          const bal = await getBTCBalance();
          setBalance(bal);
          
          const usdValue = await convertBTCToUSD(bal);
          setBalanceUSD(usdValue);
        } catch (err) {
          console.error("Error fetching balance:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBalance();
  }, [walletConnected, activeAccount]);

  // Connect wallet handler
  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  // Disconnect wallet handler
  const handleDisconnect = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      disconnectWallet();
    }
  };

  // Switch account handler
  const handleSwitchAccount = async (index) => {
    try {
      await switchAccount(index);
      // Refresh balance after switching
      const bal = await getBTCBalance();
      setBalance(bal);
      const usdValue = await convertBTCToUSD(bal);
      setBalanceUSD(usdValue);
    } catch (err) {
      console.error("Failed to switch account:", err);
    }
  };

  // Copy address handler
  const handleCopyAddress = () => {
    if (activeAccount?.address) {
      navigator.clipboard.writeText(activeAccount.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // If wallet not connected, show connect prompt
  if (!walletConnected) {
    return (
      <div className="container wallet-page">
        <h1>👛 Wallet</h1>
        <div className="connect-wallet-prompt">
          <div className="connect-wallet-icon">🔐</div>
          <h2>Connect Your Wallet</h2>
          <p>
            Connect your Xverse wallet to access all BitBuddy features. 
            Your keys, your coins - we never have access to your funds.
          </p>
          <button 
            className="connect-wallet-btn"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? '🔄 Connecting...' : '🔌 Connect Xverse Wallet'}
          </button>
          {error && (
            <div className="status-banner error" style={{ marginTop: '1rem' }}>
              ❌ {error}
            </div>
          )}
          <div className="tips-section" style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h3>💡 Don't have Xverse Wallet?</h3>
            <ul>
              <li>Download from <a href="https://www.xverse.app/" target="_blank" rel="noopener noreferrer">xverse.app</a></li>
              <li>Create a new wallet in minutes</li>
              <li>Get testnet BTC from faucets</li>
              <li>Come back and connect!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // If loading balance
  if (loading) {
    return (
      <div className="container wallet-page">
        <div className="wallet-loading">
          <h2>Loading wallet information...</h2>
        </div>
      </div>
    );
  }

  // Main wallet view
  return (
    <div className="container wallet-page">
      <h1>👛 My Wallet</h1>

      {/* Wallet Overview Card */}
      <div className="wallet-overview">
        <div className="wallet-balance">
          <div className="balance-label">Total Balance</div>
          <div className="balance-amount">{balance} BTC</div>
          <div className="balance-usd">≈ ${balanceUSD} USD</div>
        </div>

        <div className="wallet-address-section">
          <div className="address-label">Wallet Address</div>
          <div className="address-display">
            <span>{activeAccount?.address}</span>
            <button 
              className="copy-address-btn"
              onClick={handleCopyAddress}
            >
              {copySuccess ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Account Management */}
      {accountsList && accountsList.length > 0 && (
        <div className="accounts-section">
          <h2>Connected Accounts</h2>
          <div className="account-list">
            {accountsList.map((acc, index) => (
              <div 
                key={index}
                className={`account-item ${acc.address === activeAccount?.address ? 'active' : ''}`}
              >
                <div className="account-info">
                  <div className="account-name">
                    Account {index + 1}
                    {acc.address === activeAccount?.address && (
                      <span className="account-badge">Active</span>
                    )}
                  </div>
                  <div className="account-address">
                    {formatAddress(acc.address)}
                  </div>
                </div>
                {acc.address !== activeAccount?.address && (
                  <button 
                    className="switch-account-btn"
                    onClick={() => handleSwitchAccount(index)}
                  >
                    Switch
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="wallet-actions">
        <div 
          className="wallet-action-card"
          onClick={() => navigate('/send')}
        >
          <div className="action-icon">✉️</div>
          <h3 className="action-title">Send BTC</h3>
          <p className="action-description">
            Send Bitcoin to anyone
          </p>
        </div>

        <div 
          className="wallet-action-card"
          onClick={() => navigate('/bridge')}
        >
          <div className="action-icon">🌉</div>
          <h3 className="action-title">Bridge</h3>
          <p className="action-description">
            Move BTC to Starknet
          </p>
        </div>

        <div 
          className="wallet-action-card"
          onClick={() => navigate('/savings')}
        >
          <div className="action-icon">💰</div>
          <h3 className="action-title">Save</h3>
          <p className="action-description">
            Create savings goals
          </p>
        </div>

        <div 
          className="wallet-action-card"
          onClick={() => navigate('/dashboard')}
        >
          <div className="action-icon">📊</div>
          <h3 className="action-title">Dashboard</h3>
          <p className="action-description">
            View your stats
          </p>
        </div>
      </div>

      {/* Disconnect Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="btn-secondary"
          onClick={handleDisconnect}
          style={{ padding: '0.75rem 2rem' }}
        >
          🔌 Disconnect Wallet
        </button>
      </div>

      {/* Wallet Info */}
      <div className="tips-section" style={{ marginTop: '2rem' }}>
        <h3>🔐 Wallet Security Tips</h3>
        <ul>
          <li>Never share your seed phrase with anyone</li>
          <li>Always verify transaction details before confirming</li>
          <li>Use hardware wallets for large amounts</li>
          <li>Keep your Xverse extension updated</li>
        </ul>
      </div>
    </div>
  );
};

export default WalletPage;