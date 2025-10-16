// src/routes/BridgeBTCPage.jsx
import React, { useContext, useState } from 'react';
import '../styles/bridgeBTC.css';
import { WalletContext } from '../context/WalletContext';
import { bridgeBTCToStarknet } from '../services/xverseService';
import { addSocialFeedItem, unlockBadge } from '../services/firebaseService';

const BridgeBTCPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [amount, setAmount] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('starknet');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const networks = [
        {
            id: 'starknet',
            name: 'Starknet',
            icon: '🌟',
            status: 'Active',
            fee: '0.0001 BTC'
        },
        {
            id: 'lightning',
            name: 'Lightning',
            icon: '⚡',
            status: 'Coming Soon',
            fee: '~0 BTC'
        }
    ];

    const handleBridge = () => {
        if (!walletConnected) {
            setStatus('❌ Please connect your wallet first!');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setStatus('❌ Please enter a valid amount');
            return;
        }

        if (selectedNetwork !== 'starknet') {
            setStatus('❌ Only Starknet bridging is available currently');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmBridge = async () => {
        setLoading(true);
        setStatus('🔄 Bridging BTC to Starknet...');
        setShowConfirmModal(false);

        try {
            const tx = await bridgeBTCToStarknet(amount);
            
            // Add to social feed
            await addSocialFeedItem({
                user: activeAccount.address,
                action: 'bridge_completed',
                message: `Bridged ${amount} BTC to Starknet`,
                emoji: '🌉'
            });

            // Unlock bridge explorer badge
            await unlockBadge(
                activeAccount.address,
                'bridge_explorer',
                'Bridged BTC to another network!'
            );

            setStatus(`✅ Successfully bridged ${amount} BTC to Starknet!`);
            setAmount('');
            
            setTimeout(() => setStatus(''), 5000);
        } catch (err) {
            console.error('Error bridging BTC:', err);
            setStatus('❌ ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!walletConnected) {
        return (
            <div className="container">
                <div className="connect-prompt">
                    <h1>🌉 Bridge BTC</h1>
                    <p>Connect your wallet to bridge Bitcoin to other networks</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container bridge-page">
            <h1>🌉 Bridge BTC</h1>
            <p className="bridge-subtitle">
                Move your Bitcoin across networks seamlessly
            </p>

            {status && (
                <div className={`status-banner ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'info'}`}>
                    {status}
                </div>
            )}

            <div className="bridge-container">
                {/* Network Selector */}
                <div className="network-selector">
                    {networks.map((network) => (
                        <div
                            key={network.id}
                            className={`network-option ${selectedNetwork === network.id ? 'active' : ''} ${network.status !== 'Active' ? 'disabled' : ''}`}
                            onClick={() => network.status === 'Active' && setSelectedNetwork(network.id)}
                        >
                            <div className="network-icon">{network.icon}</div>
                            <div className="network-name">{network.name}</div>
                            <div className="network-status">{network.status}</div>
                        </div>
                    ))}
                </div>

                {/* Bridge Flow Visual */}
                <div className="bridge-flow">
                    <div className="bridge-chain">
                        <div className="bridge-chain-icon">₿</div>
                        <div className="bridge-chain-name">Bitcoin</div>
                    </div>
                    <div className="bridge-arrow">→</div>
                    <div className="bridge-chain">
                        <div className="bridge-chain-icon">
                            {networks.find(n => n.id === selectedNetwork)?.icon}
                        </div>
                        <div className="bridge-chain-name">
                            {networks.find(n => n.id === selectedNetwork)?.name}
                        </div>
                    </div>
                </div>

                {/* Bridge Form */}
                <div className="bridge-form">
                    <div className="form-group">
                        <label>Amount to Bridge (BTC)</label>
                        <input 
                            type="number"
                            placeholder="0.001" 
                            step="0.00000001"
                            min="0"
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={loading || selectedNetwork !== 'starknet'}
                        />
                        <small>Minimum: 0.0001 BTC | Fee: {networks.find(n => n.id === selectedNetwork)?.fee}</small>
                    </div>

                    <button 
                        className="bridge-btn"
                        onClick={handleBridge}
                        disabled={loading || !amount || selectedNetwork !== 'starknet'}
                    >
                        {loading ? '🔄 Bridging...' : '🌉 Bridge to ' + networks.find(n => n.id === selectedNetwork)?.name}
                    </button>

                    <div className="bridge-info">
                        ℹ️ <strong>Important:</strong> Bridge transactions may take 10-30 minutes to complete. 
                        You'll receive your funds on {networks.find(n => n.id === selectedNetwork)?.name} once confirmed.
                    </div>
                </div>
            </div>

            {/* Bridge Features */}
            <div className="bridge-features">
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3 className="feature-title">Fast Bridging</h3>
                    <p className="feature-description">
                        Bridge your BTC in minutes with optimized transaction routing
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">🔐</div>
                    <h3 className="feature-title">Secure & Safe</h3>
                    <p className="feature-description">
                        Audited smart contracts ensure your funds are always protected
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">💰</div>
                    <h3 className="feature-title">Low Fees</h3>
                    <p className="feature-description">
                        Competitive rates with transparent fee structure
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3 className="feature-title">Simple Process</h3>
                    <p className="feature-description">
                        Just a few clicks to bridge - no technical knowledge needed
                    </p>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirm Bridge Transaction</h2>
                            <button 
                                className="close-modal"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="confirm-details">
                                <div className="detail-row">
                                    <span>From:</span>
                                    <strong>Bitcoin Network</strong>
                                </div>
                                <div className="detail-row">
                                    <span>To:</span>
                                    <strong>{networks.find(n => n.id === selectedNetwork)?.name}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Amount:</span>
                                    <strong>{amount} BTC</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Estimated Fee:</span>
                                    <strong>{networks.find(n => n.id === selectedNetwork)?.fee}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Estimated Time:</span>
                                    <strong>10-30 minutes</strong>
                                </div>
                            </div>
                            <p className="confirm-warning">
                                ⚠️ Please verify all details carefully. Bridge transactions cannot be reversed once initiated.
                            </p>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-secondary"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={confirmBridge}
                            >
                                Confirm Bridge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BridgeBTCPage;