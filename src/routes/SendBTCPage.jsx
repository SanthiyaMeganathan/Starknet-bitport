import React, { useContext, useState } from 'react';
import '../styles/sendBTC.css';
import { WalletContext } from '../context/WalletContext';
import { sendBTC } from '../services/xverseService';

const SendBTCPage = () => {
    const { walletConnected } = useContext(WalletContext);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [memo, setMemo] = useState('');
    const [status, setStatus] = useState('');

    const handleSend = async () => {
        if (!walletConnected) {
            setStatus('Connect wallet first!');
            return;
        }

        try {
            setStatus('Sending BTC...');
            const tx = await sendBTC(recipient, amount, memo);
            setStatus(`BTC sent! Tx ID: ${tx.id || tx.hash}`);
            setRecipient('');
            setAmount('');
            setMemo('');
        } catch (err) {
            setStatus('Error sending BTC: ' + err.message);
        }
    };

    return (
        <div className="container">
            <h1>Send BTC</h1>

            <input 
                placeholder="Recipient (Wallet or Name)" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
            />
            <input 
                type="number" 
                placeholder="Amount BTC" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
            />
            <textarea 
                placeholder="Message (optional)" 
                value={memo} 
                onChange={(e) => setMemo(e.target.value)} 
            ></textarea>

            <button onClick={handleSend}>Send BTC</button>

            {status && <p className="status">{status}</p>}
            {!walletConnected && <p className="status">Wallet not connected. Please connect to send BTC.</p>}
        </div>
    );
};

export default SendBTCPage;
