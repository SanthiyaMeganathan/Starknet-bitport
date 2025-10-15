import React, { useContext, useEffect, useState } from 'react';
import '../styles/socialFeed.css';
import { WalletContext } from '../context/WalletContext';
import { getSocialFeed } from '../services/firebaseService';

const SocialFeedPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [feedItems, setFeedItems] = useState([]);

    useEffect(() => {
        const fetchFeed = async () => {
            if (walletConnected && activeAccount) {
                try {
                    const items = await getSocialFeed(activeAccount.address);
                    setFeedItems(items);
                } catch (err) {
                    console.error('Error fetching social feed:', err);
                }
            }
        };
        fetchFeed();
    }, [walletConnected, activeAccount]);

    return (
        <div className="container">
            <h1>Social Feed</h1>

            {!walletConnected && <p>Connect your wallet to see social feed updates.</p>}

            {walletConnected && (
                <>
                    {feedItems.length ? (
                        feedItems.map((item, idx) => (
                            <div className="card" key={idx}>
                                {item.message} {item.emoji || ''}
                            </div>
                        ))
                    ) : (
                        <div className="card">No social activity yet.</div>
                    )}
                </>
            )}
        </div>
    );
};

export default SocialFeedPage;
