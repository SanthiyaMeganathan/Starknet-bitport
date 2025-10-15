import React from 'react';
import '../styles/Home.css';

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Welcome to BitBuddy 🚀</h1>
            <p>
                BitBuddy is your friendly Bitcoin companion! 
                Track your BTC balance, send and receive Bitcoin, 
                bridge BTC to other networks, and gamify your savings with badges and goals.
            </p>

            <div className="features">
                <div className="feature-card">
                    <h2>📊 Dashboard</h2>
                    <p>See your BTC balance, last gifts, and unlocked badges all in one place.</p>
                </div>
                <div className="feature-card">
                    <h2>✉️ Send BTC</h2>
                    <p>Send Bitcoin easily to friends or other wallets with optional messages.</p>
                </div>
                <div className="feature-card">
                    <h2>🌉 Bridge BTC</h2>
                    <p>Move your BTC across supported networks securely.</p>
                </div>
                <div className="feature-card">
                    <h2>💰 Savings Goals</h2>
                    <p>Set fun savings goals and track progress while earning badges.</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
