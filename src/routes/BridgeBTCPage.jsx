import React, { useContext, useState } from 'react';
import '../styles/bridgeBTC.css';
import { WalletContext } from '../context/WalletContext';
import { bridgeBTCToStarknet } from '../services/xverseService';

const BridgeBTCPage = () => {
    const { walletConnected } = useContext(WalletContext);
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

    const handleBridge = async () => {
        if (!walletConnected) {
            setStatus('Connect wallet first!');
            return;
        }

        try {
            setStatus('Bridging BTC to Starknet...');
            const tx = await bridgeBTCToStarknet(amount);
            setStatus(`BTC bridged! Tx ID: ${tx.id || tx.hash}`);
            setAmount('');
        } catch (err) {
            setStatus('Error bridging BTC: ' + err.message);
        }
    };

    return (
        <div className="container">
            <h1>Bridge BTC to Starknet</h1>

            <input 
                type="number" 
                placeholder="Amount BTC" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
            />
            <button onClick={handleBridge}>Bridge BTC</button>

            {status && <p className="status">{status}</p>}
            {!walletConnected && <p className="status">Wallet not connected. Please connect to bridge BTC.</p>}
        </div>
    );
};

export default BridgeBTCPage;
