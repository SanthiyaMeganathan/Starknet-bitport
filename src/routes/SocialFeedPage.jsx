// src/routes/SocialFeedPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import '../styles/socialFeed.css';
import { WalletContext } from '../context/WalletContext';
import { getSocialFeed } from '../services/firebaseService';

const SocialFeedPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                // getSocialFeed doesn't need address parameter - it gets all feed items
                const items = await getSocialFeed(20);
                setFeedItems(items);
            } catch (err) {
                console.error('Error fetching social feed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, [walletConnected, activeAccount]);

    if (!walletConnected) {
        return (
            <div className="container">
                <div className="connect-prompt">
                    <h1>📱 Social Feed</h1>
                    <p>Connect your wallet to see community activity</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <h2>Loading social feed...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container social-feed-page">
            <h1>📱 Social Feed</h1>
            <p className="feed-subtitle">See what the BitBuddy community is up to!</p>

            {feedItems.length > 0 ? (
                <div className="feed-list">
                    {feedItems.map((item, idx) => (
                        <div className="feed-card" key={idx}>
                            <div className="feed-icon">{item.emoji || '🎉'}</div>
                            <div className="feed-content">
                                <p className="feed-message">{item.message}</p>
                                {item.timestamp && (
                                    <p className="feed-time">
                                        {new Date(item.timestamp.seconds * 1000).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">📱</div>
                    <h2>No Activity Yet</h2>
                    <p>Be the first to create some activity! Send a gift or complete a savings goal.</p>
                </div>
            )}
        </div>
    );
};

export default SocialFeedPage;