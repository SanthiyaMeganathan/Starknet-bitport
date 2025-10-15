import React from 'react';
import '../styles/sendBTC.css';

const GiftCard = ({ recipient, amount, message, nftMinted }) => {
    return (
        <div className="card">
            <p>To: {recipient}</p>
            <p>Amount: {amount} BTC</p>
            <p>Message: {message}</p>
            <p>{nftMinted ? "NFT Reward Minted ✅" : "No NFT Yet"}</p>
        </div>
    );
};

export default GiftCard;

