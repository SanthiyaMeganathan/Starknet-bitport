// src/routes/BadgesPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import '../styles/badges.css';
import { WalletContext } from '../context/WalletContext';
import { getBadges } from '../services/firebaseService';

const BadgesPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    const [badges, setBadges] = useState([]);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [loading, setLoading] = useState(true);

    // All possible badges
    const allBadges = [
        {
            type: 'first_gift',
            name: '🎁 First Gift',
            emoji: '🎁',
            description: 'Sent your first BTC gift!'
        },
        {
            type: 'generous_giver',
            name: '💝 Generous Giver',
            emoji: '💝',
            description: 'Sent 5+ BTC gifts!'
        },
        {
            type: 'savings_master',
            name: '💰 Savings Master',
            emoji: '💰',
            description: 'Completed your first savings goal!'
        },
        {
            type: 'early_adopter',
            name: '🚀 Early Adopter',
            emoji: '🚀',
            description: 'One of the first users of BitBuddy!'
        },
        {
            type: 'bridge_explorer',
            name: '🌉 Bridge Explorer',
            emoji: '🌉',
            description: 'Bridged BTC to another network!'
        },
        {
            type: 'savings_streak',
            name: '🔥 Savings Streak',
            emoji: '🔥',
            description: 'Saved BTC for 7 consecutive days!'
        }
    ];

    useEffect(() => {
        const fetchBadges = async () => {
            if (walletConnected && activeAccount) {
                try {
                    const userBadges = await getBadges(activeAccount.address);
                    setBadges(userBadges);
                } catch (err) {
                    console.error('Error fetching badges:', err);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchBadges();
    }, [walletConnected, activeAccount]);

    const isBadgeUnlocked = (badgeType) => {
        return badges.some(b => b.type === badgeType);
    };

    const getBadgeData = (badgeType) => {
        return badges.find(b => b.type === badgeType);
    };

    const handleBadgeClick = (badge) => {
        const badgeData = getBadgeData(badge.type);
        setSelectedBadge({
            ...badge,
            unlocked: !!badgeData,
            unlockedAt: badgeData?.unlockedAt
        });
    };

    if (!walletConnected) {
        return (
            <div className="container">
                <div className="connect-prompt">
                    <h1>🏅 Badges</h1>
                    <p>Connect your wallet to see your badges and achievements</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <h2>Loading your badges...</h2>
                </div>
            </div>
        );
    }

    const unlockedCount = badges.length;
    const totalCount = allBadges.length;

    return (
        <div className="container badges-page">
            <h1>🏅 My Badges</h1>
            
            <div className="badges-stats">
                <div className="stats-card">
                    <h3>Badges Earned</h3>
                    <p className="stat-number">{unlockedCount} / {totalCount}</p>
                    <div className="progress-bar">
                        <div 
                            className="progress" 
                            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="badges-grid">
                {allBadges.map((badge) => {
                    const unlocked = isBadgeUnlocked(badge.type);
                    const badgeData = getBadgeData(badge.type);
                    
                    return (
                        <div 
                            key={badge.type}
                            className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
                            onClick={() => handleBadgeClick(badge)}
                        >
                            <div className="badge-icon">{badge.emoji}</div>
                            <div className="badge-name">{badge.name}</div>
                            <div className="badge-description">{badge.description}</div>
                            <div className={`badge-status ${unlocked ? 'unlocked' : 'locked'}`}>
                                {unlocked ? '✅ Unlocked' : '🔒 Locked'}
                            </div>
                            {unlocked && badgeData?.unlockedAt && (
                                <div className="badge-date">
                                    Earned: {new Date(badgeData.unlockedAt.seconds * 1000).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {unlockedCount === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">🏅</div>
                    <h2>No Badges Yet</h2>
                    <p>Start using BitBuddy to unlock achievements!</p>
                    <div className="badge-hints">
                        <h3>How to earn badges:</h3>
                        <ul>
                            <li>Send your first BTC gift</li>
                            <li>Complete a savings goal</li>
                            <li>Bridge BTC to another network</li>
                            <li>Keep using BitBuddy regularly!</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Badge Detail Modal */}
            {selectedBadge && (
                <div className="badge-modal" onClick={() => setSelectedBadge(null)}>
                    <div className="badge-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="badge-modal-icon">
                            {selectedBadge.emoji}
                        </div>
                        <h2 className="badge-modal-title">
                            {selectedBadge.name}
                        </h2>
                        <p className="badge-modal-description">
                            {selectedBadge.description}
                        </p>
                        {selectedBadge.unlocked ? (
                            <div className="badge-modal-unlocked">
                                <p className="unlock-status">✅ You've earned this badge!</p>
                                {selectedBadge.unlockedAt && (
                                    <p className="unlock-date">
                                        Unlocked on: {new Date(selectedBadge.unlockedAt.seconds * 1000).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="badge-modal-locked">
                                <p className="lock-status">🔒 Keep going to unlock this badge!</p>
                            </div>
                        )}
                        <button 
                            className="badge-modal-close"
                            onClick={() => setSelectedBadge(null)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BadgesPage;