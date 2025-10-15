import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import { WalletContext } from '../context/WalletContext';
import WalletConnectModal from './WalletConnectModal';
import { request, AddressPurpose, RpcErrorCode } from 'sats-connect';

const Navbar = () => {
    const location = useLocation();
    const { 
        walletConnected, 
        activeAccount, 
        accountsList, 
        connectWallet: contextConnect, 
        switchAccount, 
        btcBalance 
    } = useContext(WalletContext);

    const [modalOpen, setModalOpen] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    // Connect wallet
    const handleConnect = () => {
        contextConnect();
        setDropdownVisible(true);
        setModalOpen(false);
    };

    // Disconnect wallet
    const handleDisconnect = () => {
        contextConnect(null);
        setDropdownVisible(false);
    };

    // Change wallet
    const handleChangeWallet = () => {
        contextConnect();
        setDropdownVisible(true);
    };

    // Copy wallet address
    const handleCopy = () => {
        if (activeAccount?.address) {
            navigator.clipboard.writeText(activeAccount.address);
            alert("Address copied!");
        }
    };

    // Switch account (legacy)
    const handleSwitch = (acc) => {
        switchAccount(acc);
        setModalOpen(false);
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
                                <span>Address: {activeAccount?.address}</span>
                                <button className="copy-btn" onClick={handleCopy}>📋</button>
                            </div>
                            <div className="wallet-balance">
                                BTC Balance: {btcBalance} sats
                            </div>
                            <button onClick={handleDisconnect}>Disconnect Wallet</button>
                            <button onClick={handleChangeWallet}>Change Wallet</button>
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
                    onSwitch={handleSwitch}
                />
            )}
        </>
    );
};

export default Navbar;
