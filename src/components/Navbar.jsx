// src/components/Navbar.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import { WalletContext } from '../context/WalletContext';

const Navbar = () => {
    const location = useLocation();
    const { 
        walletConnected, 
        activeAccount, 
        accountsList, 
        connectWallet, 
        disconnectWallet,
        switchAccount,
        isConnecting,
        error 
    } = useContext(WalletContext);
    
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    // Handle wallet connection
    const handleConnect = async () => {
        try {
            await connectWallet();
            setDropdownVisible(true);
        } catch (err) {
            console.error("Wallet connect failed:", err);
            alert(`Connection failed: ${err.message}`);
        }
    };

    // Handle wallet disconnection
    const handleDisconnect = () => {
        disconnectWallet();
        setDropdownVisible(false);
    };

    // Handle account switch
    const handleSwitchAccount = async (index) => {
        try {
            await switchAccount(index);
            setDropdownVisible(false);
        } catch (err) {
            console.error("Switch account failed:", err);
            alert(`Switch failed: ${err.message}`);
        }
    };

    // Copy wallet address to clipboard
    const handleCopy = () => {
        if (activeAccount?.address) {
            navigator.clipboard.writeText(activeAccount.address);
            alert("Address copied to clipboard!");
        }
    };

    // Format address for display (show first 6 and last 4 characters)
    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            {/* Left-side navigation links */}
            <div className="nav-left">
                <Link className={location.pathname === '/' ? 'active' : ''} to="/">
                    🏠 Home
                </Link>
                <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">
                    📊 Dashboard
                </Link>
                <Link className={location.pathname === '/send' ? 'active' : ''} to="/send">
                    ✉️ Send BTC
                </Link>
                <Link className={location.pathname === '/bridge' ? 'active' : ''} to="/bridge">
                    🌉 Bridge BTC
                </Link>
                <Link className={location.pathname === '/savings' ? 'active' : ''} to="/savings">
                    💰 Savings
                </Link>
                <Link className={location.pathname === '/badges' ? 'active' : ''} to="/badges">
                    🏅 Badges
                </Link>
            </div>

            {/* Wallet connection button and dropdown */}
            <div className="wallet-container" ref={dropdownRef}>
                <button 
                    className={`wallet-btn ${walletConnected ? 'connected' : ''}`}
                    onClick={walletConnected ? () => setDropdownVisible(!dropdownVisible) : handleConnect}
                    disabled={isConnecting}
                >
                    {isConnecting ? 'Connecting...' : walletConnected ? formatAddress(activeAccount?.address) : 'Connect Wallet'}
                </button>

                {/* Dropdown menu for connected wallet */}
                {walletConnected && dropdownVisible && (
                    <div className="wallet-dropdown show">
                        <div className="wallet-address">
                            <span>Address: {activeAccount?.address}</span>
                            <button className="copy-btn" onClick={handleCopy} title="Copy address">
                                📋
                            </button>
                        </div>

                        {/* Show multiple accounts if available */}
                        {accountsList?.length > 1 && (
                            <div className="accounts-list">
                                <p className="accounts-title">Switch Account:</p>
                                {accountsList.map((acc, index) => (
                                    <div 
                                        key={index} 
                                        className={`account-item ${acc.address === activeAccount?.address ? 'active' : ''}`}
                                    >
                                        <span>{formatAddress(acc.address)}</span>
                                        {acc.address !== activeAccount?.address && (
                                            <button onClick={() => handleSwitchAccount(index)}>
                                                Switch
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <button className="disconnect-btn" onClick={handleDisconnect}>
                            Disconnect Wallet
                        </button>
                    </div>
                )}

                {/* Show error message if any */}
                {error && !dropdownVisible && (
                    <div className="wallet-error">
                        {error}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;