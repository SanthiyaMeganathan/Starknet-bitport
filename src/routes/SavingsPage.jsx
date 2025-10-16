// src/routes/SavingsPage.jsx
import React, { useContext, useEffect, useState } from 'react';
import '../styles/savings.css';
import { WalletContext } from '../context/WalletContext';
import { 
    getSavingsGoals, 
    addSavingsGoal, 
    contributeSavings, 
    deleteSavingsGoal,
    updateSavingsGoal 
} from '../services/firebaseService';
import SavingsCard from '../components/SavingsCard';
import ProgressBar from '../components/ProgressBar';

const SavingsPage = () => {
    const { walletConnected, activeAccount } = useContext(WalletContext);
    
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    
    // Form states
    const [goalName, setGoalName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [contributeAmount, setContributeAmount] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    // Fetch savings goals
    useEffect(() => {
        const fetchSavings = async () => {
            if (walletConnected && activeAccount) {
                try {
                    const goals = await getSavingsGoals(activeAccount.address);
                    setSavingsGoals(goals);
                } catch (err) {
                    console.error('Error fetching savings goals:', err);
                }
            }
        };
        fetchSavings();
    }, [walletConnected, activeAccount]);

    // Add new savings goal
    const handleAddGoal = async () => {
        if (!goalName || !targetAmount) {
            setStatus('❌ Please fill in all required fields');
            return;
        }

        if (parseFloat(targetAmount) <= 0) {
            setStatus('❌ Target amount must be greater than 0');
            return;
        }

        setLoading(true);
        setStatus('🔄 Creating savings goal...');

        try {
            await addSavingsGoal(activeAccount.address, {
                name: goalName,
                targetAmount: parseFloat(targetAmount),
                deadline: deadline || null
            });

            setStatus('✅ Savings goal created!');
            
            // Refresh goals
            const updatedGoals = await getSavingsGoals(activeAccount.address);
            setSavingsGoals(updatedGoals);
            
            // Reset form
            setGoalName('');
            setTargetAmount('');
            setDeadline('');
            setShowAddModal(false);
            
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('❌ Failed to create goal: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Contribute to savings goal
    const handleContribute = async () => {
        if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
            setStatus('❌ Please enter a valid amount');
            return;
        }

        setLoading(true);
        setStatus('🔄 Adding contribution...');

        try {
            await contributeSavings(selectedGoal.id, parseFloat(contributeAmount));
            setStatus('✅ Contribution added!');
            
            // Refresh goals
            const updatedGoals = await getSavingsGoals(activeAccount.address);
            setSavingsGoals(updatedGoals);
            
            setContributeAmount('');
            setShowContributeModal(false);
            setSelectedGoal(null);
            
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('❌ Failed to contribute: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete savings goal
    const handleDeleteGoal = async (goalId) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) {
            return;
        }

        try {
            await deleteSavingsGoal(goalId);
            const updatedGoals = await getSavingsGoals(activeAccount.address);
            setSavingsGoals(updatedGoals);
            setStatus('✅ Goal deleted');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            setStatus('❌ Failed to delete goal: ' + err.message);
        }
    };

    if (!walletConnected) {
        return (
            <div className="container">
                <div className="connect-prompt">
                    <h1>💰 Savings Goals</h1>
                    <p>Connect your wallet to manage your savings goals</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container savings-page">
            <div className="page-header">
                <h1>💰 My Savings Goals</h1>
                <button 
                    className="add-goal-btn"
                    onClick={() => setShowAddModal(true)}
                >
                    ➕ Add New Goal
                </button>
            </div>

            {status && (
                <div className={`status-banner ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : 'info'}`}>
                    {status}
                </div>
            )}

            {savingsGoals.length > 0 ? (
                <div className="goals-grid">
                    {savingsGoals.map((goal) => {
                        const progress = (goal.currentAmount / goal.targetAmount) * 100;
                        const isCompleted = goal.status === 'completed';
                        
                        return (
                            <div className={`goal-card ${isCompleted ? 'completed' : ''}`} key={goal.id}>
                                <div className="goal-header">
                                    <h3>{goal.name}</h3>
                                    {isCompleted && <span className="badge-completed">✅ Completed</span>}
                                </div>
                                
                                <div className="goal-amounts">
                                    <span className="current">{goal.currentAmount.toFixed(8)} BTC</span>
                                    <span className="separator">/</span>
                                    <span className="target">{goal.targetAmount.toFixed(8)} BTC</span>
                                </div>
                                
                                <ProgressBar progress={Math.min(progress, 100)} />
                                
                                <div className="goal-stats">
                                    <span>{progress.toFixed(1)}% Complete</span>
                                    {goal.deadline && (
                                        <span className="deadline">
                                            📅 {new Date(goal.deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                                
                                {!isCompleted && (
                                    <div className="goal-actions">
                                        <button 
                                            className="contribute-btn"
                                            onClick={() => {
                                                setSelectedGoal(goal);
                                                setShowContributeModal(true);
                                            }}
                                        >
                                            💰 Add Funds
                                        </button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteGoal(goal.id)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">💰</div>
                    <h2>No Savings Goals Yet</h2>
                    <p>Create your first savings goal to start building your Bitcoin savings!</p>
                    <button 
                        className="cta-btn"
                        onClick={() => setShowAddModal(true)}
                    >
                        Create Your First Goal
                    </button>
                </div>
            )}

            {/* Add Goal Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Create New Savings Goal</h2>
                            <button 
                                className="close-modal"
                                onClick={() => setShowAddModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Goal Name</label>
                                <input 
                                    type="text"
                                    placeholder="e.g., New Laptop, Emergency Fund"
                                    value={goalName}
                                    onChange={(e) => setGoalName(e.target.value)}
                                    maxLength="50"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Target Amount (BTC)</label>
                                <input 
                                    type="number"
                                    placeholder="0.01"
                                    step="0.00000001"
                                    min="0"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Deadline (Optional)</label>
                                <input 
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-secondary"
                                onClick={() => setShowAddModal(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleAddGoal}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Goal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Contribute Modal */}
            {showContributeModal && selectedGoal && (
                <div className="modal-overlay" onClick={() => setShowContributeModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add Funds to {selectedGoal.name}</h2>
                            <button 
                                className="close-modal"
                                onClick={() => setShowContributeModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="goal-progress-info">
                                <p>Current: {selectedGoal.currentAmount.toFixed(8)} BTC</p>
                                <p>Target: {selectedGoal.targetAmount.toFixed(8)} BTC</p>
                                <p>Remaining: {(selectedGoal.targetAmount - selectedGoal.currentAmount).toFixed(8)} BTC</p>
                            </div>
                            
                            <div className="form-group">
                                <label>Amount to Add (BTC)</label>
                                <input 
                                    type="number"
                                    placeholder="0.001"
                                    step="0.00000001"
                                    min="0"
                                    value={contributeAmount}
                                    onChange={(e) => setContributeAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-secondary"
                                onClick={() => setShowContributeModal(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleContribute}
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Funds'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavingsPage;