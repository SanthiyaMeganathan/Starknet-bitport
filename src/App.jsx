// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import HomePage from './routes/HomePage';
import DashboardPage from './routes/DashboardPage';
import SendBTCPage from './routes/SendBTCPage';
import BridgeBTCPage from './routes/BridgeBTCPage';
import SavingsPage from './routes/SavingsPage';
import BadgesPage from './routes/BadgesPage';
import WalletPage from './routes/WalletPage';
import SocialFeedPage from './routes/SocialFeedPage';
import './styles/global.css';

function App() {
    return (
        <WalletProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/send" element={<SendBTCPage />} />
                    <Route path="/bridge" element={<BridgeBTCPage />} />
                    <Route path="/savings" element={<SavingsPage />} />
                    <Route path="/badges" element={<BadgesPage />} />
                    <Route path="/wallet" element={<WalletPage />} />
                    <Route path="/social" element={<SocialFeedPage />} />
                </Routes>
            </Router>
        </WalletProvider>
    );
}

export default App;