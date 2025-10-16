// src/routes/SendBTCPage.jsx
import React, { useContext, useState } from 'react';
import '../styles/sendBTC.css';
import { WalletContext } from '../context/WalletContext';
import { sendBTC } from '../services/xverseService';
import { addGift, addSocialFeedItem } from '../services/firebaseService';

const SendBTCPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleSend = async () => {
        if (!walletConnected) {
            setStatus('❌ Please connect your wallet first!');
            return;
        }

        if (!recipient || !amount) {
            setStatus('❌ Please fill in recipient and amount');
            return;
        }

        if (parseFloat(amount) <= 0) {
            setStatus('❌ Amount must be greater than 0');
            return;
        }

        setShowConfirmModal(true);
    };

    const confirmSend = async () => {
        setLoading(true);
        setStatus('🔄 Sending BTC...');
        setShowConfirmModal(false);

        try {
            // Send BTC via Xverse
            const tx = await sendBTC(recipient, amount, memo);
            
            // Record gift in Firebase
            await addGift({
                sender: activeAccount.address,
                recipient: recipient,
                amount: parseFloat(amount),
                message: memo,
                txId: tx.txid || tx.id || 'pending'
            });

            // Add to social feed
            await addSocialFeedItem({
                user: activeAccount.address,
                action: 'gift_sent',
                message: `Sent ${amount} BTC to ${recipient.slice(0, 8)}...`,
                emoji: '🎁'
            });

            setStatus(`✅ BTC sent successfully! TX ID: ${tx.txid || tx.id || 'pending'}`);
            
            // Reset form
            setRecipient('');
            setAmount('');
            setMemo('');
            
            setTimeout(() => setStatus(''), 5000);
        } catch (err) {
            console.error('Error sending BTC:', err);
            setStatus('❌ Failed to send BTC: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!walletConnected) {
        return (
            <div className="container">
                <div className="connect-prompt">
                    <h1>✉️ Send BTC</h1>
                    <p>Connect your wallet to send Bitcoin</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container send-page">
            <h1>✉️ Send BTC</h1>

            {status && (
                <div className={`status-banner ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'info'}`}>
                    {status}
                </div>
            )}

            <div className="send-form">
                <div className="form-group">
                    <label>Recipient Address</label>
                    <input 
                        type="text"
                        placeholder="Bitcoin address (e.g., tb1q...)" 
                        value={recipient} 
                        onChange={(e) => setRecipient(e.target.value)}
                        disabled={loading}
                    />
                    <small>Enter a valid Bitcoin testnet address</small>
                </div>

                <div className="form-group">
                    <label>Amount (BTC)</label>
                    <input 
                        type="number"
                        placeholder="0.001" 
                        step="0.00000001"
                        min="0"
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={loading}
                    />
                    <small>Minimum amount: 0.00000001 BTC</small>
                </div>

                <div className="form-group">
                    <label>Message (Optional)</label>
                    <textarea 
                        placeholder="Add a personal message..." 
                        value={memo} 
                        onChange={(e) => setMemo(e.target.value.slice(0, 200))}
                        rows="4"
                        disabled={loading}
                        maxLength="200"
                    />
                    <small>{memo.length}/200 characters</small>
                </div>

                <button 
                    className="send-btn"
                    onClick={handleSend}
                    disabled={loading || !recipient || !amount}
                >
                    {loading ? '🔄 Sending...' : '✉️ Send BTC'}
                </button>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Confirm Transaction</h2>
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
                                    <span>To:</span>
                                    <strong>{recipient}</strong>
                                </div>
                                <div className="detail-row">
                                    <span>Amount:</span>
                                    <strong>{amount} BTC</strong>
                                </div>
                                {memo && (
                                    <div className="detail-row">
                                        <span>Message:</span>
                                        <strong>{memo}</strong>
                                    </div>
                                )}
                            </div>
                            <p className="confirm-warning">
                                ⚠️ Please verify the recipient address carefully. Bitcoin transactions cannot be reversed.
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
                                onClick={confirmSend}
                            >
                                Confirm & Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Tips */}
            <div className="tips-section">
                <h3>💡 Tips for Sending BTC</h3>
                <ul>
                    <li>Always double-check the recipient address</li>
                    <li>Start with small test transactions</li>
                    <li>Bitcoin transactions are irreversible</li>
                    <li>You're using Bitcoin Testnet for practice</li>
                </ul>
            </div>
        </div>
    );
};

export default SendBTCPage;