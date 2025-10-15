import React, { useContext } from 'react';
import '../styles/modal.css';
import { WalletContext } from '../context/WalletContext';

const WalletConnectModal = ({ onClose, onConnect, onSwitch }) => {
    const { accountsList, walletConnected } = useContext(WalletContext);

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <h2>Select Account / Connect Wallet</h2>

                {walletConnected && accountsList && accountsList.length > 0 ? (
                    <ul>
                        {accountsList.map((acc, idx) => (
                            <li key={idx} style={{ marginBottom: '10px' }}>
                                <button
                                    onClick={() => onSwitch(acc)}
                                >
                                    Switch: {acc.name} ({acc.address})
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <p>No accounts connected yet.</p>
                        <button onClick={onConnect}>Connect Xverse Wallet</button>
                    </div>
                )}

                <button className="close-btn" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default WalletConnectModal;

