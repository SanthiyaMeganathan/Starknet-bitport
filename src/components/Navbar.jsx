import React, { useContext, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import { WalletContext } from '../context/WalletContext';
import WalletConnectModal from './WalletConnectModal';

import { connectWallet as xverseConnect } from '../services/xverseService';

const Navbar = () => {
    const location = useLocation();
    const { walletConnected, activeAccount, accountsList, connectWallet: contextConnect, switchAccount } = useContext(WalletContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    // Connect wallet via Xverse
    const handleConnect = async () => {
        try {
            const { currentAccount, accountsList } = await xverseConnect();
            contextConnect(currentAccount, accountsList);
            setDropdownVisible(true);
            setModalOpen(false);
        } catch (err) {
            console.error("Wallet connect failed:", err);
        }
    };

    // Disconnect wallet
    const handleDisconnect = () => {
        contextConnect(null, []);
        setDropdownVisible(false);
    };

    // Switch account
    const handleSwitchAccount = async (index) => {
        try {
            const switchedAccount = await switchAccount(index);
            console.log("Switched account:", switchedAccount);
            setDropdownVisible(false);
        } catch (err) {
            console.error("Switch account failed:", err);
        }
    };

    // Copy wallet address
    const handleCopy = () => {
        if (activeAccount?.address) {
            navigator.clipboard.writeText(activeAccount.address);
            alert("Address copied!");
        }
    };

    return (
        <>
            <nav className="navbar">
                {/* Left-side links */}
                <div className="nav-left">
                    <Link className={location.pathname === '/' ? 'active' : ''} to="/">🏠 Home</Link>
                    <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">📊 Dashboard</Link>
                    <Link className={location.pathname === '/send' ? 'active' : ''} to="/send">✉️ Send BTC</Link>
                    <Link className={location.pathname === '/bridge' ? 'active' : ''} to="/bridge">🌉 Bridge BTC</Link>
                    <Link className={location.pathname === '/savings' ? 'active' : ''} to="/savings">💰 Savings</Link>
                    <Link className={location.pathname === '/badges' ? 'active' : ''} to="/badges">🏅 Badges</Link>
                </div>

                {/* Wallet Button */}
                <div 
                    className="wallet-container"
                    onMouseEnter={() => walletConnected && setDropdownVisible(true)}
                    onMouseLeave={() => setDropdownVisible(false)}
                >
                    <button 
                        className={`wallet-btn ${walletConnected ? 'connected' : ''}`}
                        onClick={handleConnect}
                    >
                        {walletConnected ? "Connected" : "Connect Wallet"}
                    </button>

                    {walletConnected && (
                        <div className={`wallet-dropdown ${dropdownVisible ? 'show' : ''}`} ref={dropdownRef}>
                            <div className="wallet-address">
                                Address: {activeAccount?.address}
                                <button className="copy-btn" onClick={handleCopy}>📋</button>
                            </div>

                            {/* List of all connected accounts */}
                            {accountsList?.length > 1 && (
                                <div className="accounts-list">
                                    {accountsList.map((acc, index) => (
                                        <div key={index} className={`account-item ${acc.address === activeAccount.address ? 'active' : ''}`}>
                                            {acc.address}
                                            {acc.address !== activeAccount.address && (
                                                <button onClick={() => handleSwitchAccount(index)}>Switch</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button onClick={handleDisconnect}>Disconnect Wallet</button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Legacy WalletConnectModal */}
            {modalOpen && (
                <WalletConnectModal
                    accountsList={accountsList}
                    onClose={() => setModalOpen(false)}
                    onConnect={handleConnect}
                    onSwitch={handleSwitchAccount}
                />
            )}
        </>
    );
};

export default Navbar;
