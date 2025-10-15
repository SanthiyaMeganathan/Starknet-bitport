import React, { useContext, useEffect, useState } from 'react';
import '../styles/badges.css';
import { WalletContext } from '../context/WalletContext';
// import { getBadges } from '../services/firebaseService';

const BadgesPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        const fetchBadges = async () => {
            if (walletConnected && activeAccount) {
                try {
                    const userBadges = await getBadges(activeAccount.address);
                    setBadges(userBadges);
                } catch (err) {
                    console.error('Error fetching badges:', err);
                }
            }
        };
        fetchBadges();
    }, [walletConnected, activeAccount]);

    return (
        <div className="container">
            <h1>My Badges</h1>
            {!walletConnected && <p>Connect wallet to see your badges.</p>}

            {walletConnected && (
                <>
                    {badges.length ? (
                        badges.map((badge, idx) => (
                            <div className="card" key={idx}>
                                {badge.emoji} {badge.name}
                            </div>
                        ))
                    ) : (
                        <div className="card">No badges unlocked yet.</div>
                    )}
                </>
            )}
        </div>
    );
};

export default BadgesPage;


