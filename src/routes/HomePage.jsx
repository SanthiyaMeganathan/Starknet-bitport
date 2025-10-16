// src/routes/HomePage.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import { WalletContext } from '../context/WalletContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { walletConnected, connectWallet } = useContext(WalletContext);

    const handleGetStarted = () => {
        if (walletConnected) {
            navigate('/dashboard');
        } else {
            navigate('/wallet');
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to BitBuddy 🚀</h1>
            <p>
                Your friendly Bitcoin companion for managing, saving, and gifting BTC with ease.
                Experience the future of Bitcoin management with gamification, social features, and seamless bridging.
            </p>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-icon">₿</div>
                    <h2 className="hero-title">Manage Bitcoin Like Never Before</h2>
                    <p className="hero-description">
                        BitBuddy makes Bitcoin simple, fun, and social. Send BTC, save towards goals, 
                        earn badges, and bridge to other networks - all in one beautiful interface.
                    </p>
                    <div className="hero-cta">
                        <button 
                            className="cta-button cta-primary"
                            onClick={handleGetStarted}
                        >
                            {walletConnected ? '📊 Go to Dashboard' : '🚀 Get Started'}
                        </button>
                        <button 
                            className="cta-button cta-secondary"
                            onClick={() => navigate('/badges')}
                        >
                            🏅 View Badges
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Introduction */}
            <section className="features-intro">
                <h2>Why Choose BitBuddy?</h2>
                <p>Everything you need to master Bitcoin, all in one place</p>
            </section>

            {/* Features Grid */}
            <div className="features">
                <div className="feature-card">
                    <h2>📊 Smart Dashboard</h2>
                    <p>
                        Track your BTC balance, monitor savings goals, view recent gifts, 
                        and see live price charts - all in one beautiful dashboard.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>✉️ Send BTC Easily</h2>
                    <p>
                        Send Bitcoin to anyone with just a few clicks. Add personal messages, 
                        mint NFT rewards, and share the joy of giving crypto.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>🌉 Bridge to Starknet</h2>
                    <p>
                        Seamlessly bridge your BTC to Starknet and explore DeFi opportunities. 
                        One-click bridging made simple for everyone.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>💰 Micro-Savings Goals</h2>
                    <p>
                        Set and track savings goals with progress visualization. Build your Bitcoin 
                        wealth gradually with gamified milestones.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>🏅 Earn Badges</h2>
                    <p>
                        Complete actions and unlock achievement badges. Turn Bitcoin management 
                        into a fun, rewarding experience.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>🎁 Social Gifting</h2>
                    <p>
                        Send BTC gifts with personal messages. Share crypto love with friends 
                        and family in a meaningful way.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>📈 Live Price Data</h2>
                    <p>
                        Stay informed with real-time Bitcoin prices, 24h changes, and historical 
                        charts powered by CoinGecko.
                    </p>
                </div>

                <div className="feature-card">
                    <h2>🔐 Secure Wallet</h2>
                    <p>
                        Connect your Xverse wallet securely. Your keys, your coins - we never 
                        have access to your funds.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <section className="stats-section">
                <h2>BitBuddy by the Numbers</h2>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-number">100%</div>
                        <div className="stat-label">Open Source</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">∞</div>
                        <div className="stat-label">Possibilities</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">6+</div>
                        <div className="stat-label">Badges to Earn</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-number">24/7</div>
                        <div className="stat-label">Available</div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-icon">🔌</div>
                        <h3 className="step-title">Connect Wallet</h3>
                        <p className="step-description">
                            Connect your Xverse wallet in seconds. No signup required.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-icon">🎯</div>
                        <h3 className="step-title">Set Your Goals</h3>
                        <p className="step-description">
                            Create savings goals, explore features, and customize your experience.
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-icon">🚀</div>
                        <h3 className="step-title">Start Using</h3>
                        <p className="step-description">
                            Send BTC, save, bridge, and earn badges as you go!
                        </p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <div className="step-icon">🏆</div>
                        <h3 className="step-title">Earn Rewards</h3>
                        <p className="step-description">
                            Unlock achievements and NFT badges for your Bitcoin journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="hero-section">
                <div className="hero-content">
                    <h2 className="hero-title">Ready to Start Your Bitcoin Journey?</h2>
                    <p className="hero-description">
                        Join BitBuddy today and experience Bitcoin management like never before. 
                        No credit card required. Just connect your wallet and go!
                    </p>
                    <div className="hero-cta">
                        <button 
                            className="cta-button cta-primary"
                            onClick={handleGetStarted}
                        >
                            {walletConnected ? '📊 Open Dashboard' : '🚀 Get Started Free'}
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;