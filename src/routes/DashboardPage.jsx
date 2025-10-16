// src/routes/DashboardPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import '../styles/dashboard.css';
import { WalletContext } from '../context/WalletContext';
import { getBTCBalance } from '../services/xverseService';
import { getSavingsGoals, getGifts, getBadges, getUserStats } from '../services/firebaseService';
import { getBTCPrice, getBTCChartData, convertBTCToUSD } from '../services/coingeckoService';
import BTCBalanceCard from '../components/BTCBalanceCard';
import SavingsCard from '../components/SavingsCard';
import GiftCard from '../components/GiftCard';
import BadgeCard from '../components/BadgeCard';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    
    // State
    const [balance, setBalance] = useState('0');
    const [balanceUSD, setBalanceUSD] = useState('0.00');
    const [btcPrice, setBtcPrice] = useState(0);
    const [priceChange24h, setPriceChange24h] = useState(0);
    const [chartData, setChartData] = useState(null);
    
    const [savings, setSavings] = useState([]);
    const [gifts, setGifts] = useState([]);
    const [badges, setBadges] = useState([]);
    const [stats, setStats] = useState(null);
    
    const [loading, setLoading] = useState(true);

    // Fetch all dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!walletConnected || !activeAccount) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                // Fetch BTC balance
                const bal = await getBTCBalance();
                setBalance(bal);

                // Fetch BTC price and market data
                const price = await getBTCPrice();
                setBtcPrice(price);

                // Convert balance to USD
                const usdValue = await convertBTCToUSD(bal);
                setBalanceUSD(usdValue);

                // Fetch price chart data
                const priceData = await getBTCChartData(7);
                if (priceData.length > 0) {
                    setChartData({
                        labels: priceData.map(d => d.date),
                        datasets: [
                            {
                                label: 'BTC Price (USD)',
                                data: priceData.map(d => d.price),
                                borderColor: 'rgb(102, 126, 234)',
                                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                tension: 0.4
                            }
                        ]
                    });
                }

                // Fetch user data from Firebase
                const [userSavings, userGifts, userBadges, userStats] = await Promise.all([
                    getSavingsGoals(activeAccount.address),
                    getGifts(activeAccount.address),
                    getBadges(activeAccount.address),
                    getUserStats(activeAccount.address)
                ]);

                setSavings(userSavings);
                setGifts(userGifts);
                setBadges(userBadges);
                setStats(userStats);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [walletConnected, activeAccount]);

    if (!walletConnected) {
        return (
            <div className="container">
                <div className="connect-prompt">
                    <h1>📊 Dashboard</h1>
                    <p>Connect your wallet to see your dashboard</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <h2>Loading your dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="container dashboard">
            <h1>📊 Dashboard</h1>

            {/* Balance Overview */}
            <div className="dashboard-grid">
                <BTCBalanceCard balanceBTC={balance} balanceUSD={balanceUSD} />
                
                <div className="card stats-card">
                    <h3>BTC Price</h3>
                    <p className="btc-price">${btcPrice.toLocaleString()}</p>
                    <p className={`price-change ${priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                        {priceChange24h >= 0 ? '📈' : '📉'} {Math.abs(priceChange24h).toFixed(2)}%
                    </p>
                </div>

                {stats && (
                    <div className="card stats-card">
                        <h3>Your Stats</h3>
                        <div className="stat-item">
                            <span>Gifts Sent:</span>
                            <strong>{stats.totalGiftsSent}</strong>
                        </div>
                        <div className="stat-item">
                            <span>BTC Gifted:</span>
                            <strong>{stats.totalBTCGifted.toFixed(8)} BTC</strong>
                        </div>
                        <div className="stat-item">
                            <span>Badges Earned:</span>
                            <strong>{stats.totalBadges}</strong>
                        </div>
                    </div>
                )}
            </div>

            {/* BTC Price Chart */}
            {chartData && (
                <div className="card chart-card">
                    <h3>BTC Price (7 Days)</h3>
                    <Line 
                        data={chartData} 
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: false
                                }
                            }
                        }}
                    />
                </div>
            )}

            {/* Savings Goals */}
            <div className="section">
                <h2>💰 Savings Goals</h2>
                {savings.length > 0 ? (
                    <div className="cards-grid">
                        {savings.slice(0, 3).map((goal) => (
                            <SavingsCard
                                key={goal.id}
                                goalName={goal.name}
                                currentAmount={goal.currentAmount}
                                targetAmount={goal.targetAmount}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card empty-state">
                        <p>No savings goals yet. Create one to start saving!</p>
                    </div>
                )}
            </div>

            {/* Recent Gifts */}
            <div className="section">
                <h2>🎁 Recent Gifts</h2>
                {gifts.length > 0 ? (
                    <div className="cards-grid">
                        {gifts.slice(0, 3).map((gift) => (
                            <GiftCard
                                key={gift.id}
                                recipient={gift.recipient}
                                amount={gift.amount}
                                message={gift.message}
                                nftMinted={gift.nftMinted}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card empty-state">
                        <p>No gifts sent yet. Send your first BTC gift!</p>
                    </div>
                )}
            </div>

            {/* Badges */}
            <div className="section">
                <h2>🏅 Your Badges</h2>
                {badges.length > 0 ? (
                    <div className="badges-grid">
                        {badges.map((badge) => (
                            <BadgeCard
                                key={badge.id}
                                badgeName={badge.name}
                                unlocked={badge.unlocked}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card empty-state">
                        <p>No badges unlocked yet. Complete actions to earn badges!</p>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button 
                    className="action-btn primary"
                    onClick={() => window.location.href = '/send'}
                >
                    ✉️ Send BTC
                </button>
                <button 
                    className="action-btn secondary"
                    onClick={() => window.location.href = '/savings'}
                >
                    💰 Add Savings Goal
                </button>
                <button 
                    className="action-btn tertiary"
                    onClick={() => window.location.href = '/bridge'}
                >
                    🌉 Bridge BTC
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;