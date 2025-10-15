import React from 'react';
import '../styles/savings.css';

const SavingsCard = ({ goalName, currentAmount, targetAmount }) => {
    return (
        <div className="card">
            <h3>{goalName}</h3>
            <p>{currentAmount} / {targetAmount} BTC</p>
            <div className="progress-bar">
                <div style={{ width: `${(currentAmount / targetAmount) * 100}%` }} className="progress"></div>
            </div>
        </div>
    );
};

export default SavingsCard;
