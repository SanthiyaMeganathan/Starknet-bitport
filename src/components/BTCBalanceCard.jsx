import React from 'react';
import '../styles/dashboard.css';

const BTCBalanceCard = ({ balanceBTC, balanceUSD }) => {
    return (
        <div className="card">
            <h3>BTC Balance</h3>
            <p>{balanceBTC} BTC (~${balanceUSD})</p>
        </div>
    );
};

export default BTCBalanceCard;
