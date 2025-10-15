import React, { useContext, useEffect, useState } from 'react';
import '../styles/dashboard.css';
import { WalletContext } from '../context/WalletContext';
import { getBTCBalance } from '../services/xverseService';
import { getSavingsGoals, getGifts, getBadges } from '../services/firebaseService';

const DashboardPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [balance, setBalance] = useState('0');
    const [savings, setSavings] = useState({ current: 0, target: 0 });
    const [lastGift, setLastGift] = useState(null);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (walletConnected && activeAccount) {
                try {
                    const bal = await getBTCBalance();
                    setBalance(bal);

                    const userSavings = await getSavingsGoals(activeAccount.address);
                    setSavings(userSavings);

                    const gifts = await getGifts(activeAccount.address);
                    setLastGift(gifts.length ? gifts[gifts.length - 1] : null);

                    const userBadges = await getBadges(activeAccount.address);
                    setBadges(userBadges);
                } catch (err) {
                    console.error('Error fetching dashboard data:', err);
                }
            }
        };
        fetchData();
    }, [walletConnected, activeAccount]);

    return (
        <div className="container">
            <h1>Dashboard</h1>
            <div className="card">
                BTC Balance: {walletConnected ? `${balance} BTC` : 'Connect wallet to see balance'}
            </div>
            <div className="card">
                Savings Goal: {walletConnected ? `${savings.current} / ${savings.target} BTC` : 'Connect wallet to see savings'}
            </div>
            <div className="card">
                Last Gift Sent: {walletConnected && lastGift ? `${lastGift.amount} BTC to ${lastGift.recipient}` : 'No gifts sent yet'}
            </div>
            <div className="card">
                Unlocked Badges: {walletConnected && badges.length ? badges.map(b => b.name).join(', ') : 'No badges unlocked'}
            </div>
        </div>
    );
};

export default DashboardPage;
