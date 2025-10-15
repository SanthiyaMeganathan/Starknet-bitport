import React, { useContext, useEffect, useState } from 'react';
import '../styles/savings.css';
import { WalletContext } from '../context/WalletContext';
import { getSavingsGoals } from '../services/firebaseService';

const SavingsPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [savingsGoals, setSavingsGoals] = useState([]);

    useEffect(() => {
        const fetchSavings = async () => {
            if (walletConnected && activeAccount) {
                try {
                    const goals = await getSavingsGoals(activeAccount.address);
                    setSavingsGoals(goals);
                } catch (err) {
                    console.error('Error fetching savings goals:', err);
                }
            }
        };
        fetchSavings();
    }, [walletConnected, activeAccount]);

    return (
        <div className="container">
            <h1>My Savings Goals</h1>
            {!walletConnected && <p>Connect wallet to see your savings goals.</p>}

            {walletConnected && (
                <>
                    {savingsGoals.length ? (
                        savingsGoals.map((goal, idx) => (
                            <div className="card" key={idx}>
                                {goal.name}: {goal.currentAmount} / {goal.targetAmount} BTC
                            </div>
                        ))
                    ) : (
                        <div className="card">No savings goals found.</div>
                    )}
                </>
            )}
        </div>
    );
};

export default SavingsPage;
