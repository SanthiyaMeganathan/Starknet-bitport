import React, { useContext, useState } from 'react';
import '../styles/wallet.css';
import { WalletContext } from '../context/WalletContext';
import { connectWallet, getBTCBalance, switchAccount } from '../services/xverseService';

const WalletPage = () => {
  const { 
    walletConnected, 
    activeAccount, 
    accountsList, 
    connectWallet: contextConnect, 
    switchAccount: contextSwitchAccount 
  } = useContext(WalletContext);

  const [balance, setBalance] = useState("0");
  const [status, setStatus] = useState("");

  // Connect wallet
  const handleConnect = async () => {
    setStatus("Connecting wallet...");

    try {
      const { currentAccount, accountsList } = await connectWallet();

      // Update context with both current account and accounts list
      contextConnect(currentAccount, accountsList);

      try {
        const bal = await getBTCBalance();
        setBalance(bal);
        setStatus("Wallet connected successfully!");
      } catch (balanceErr) {
        console.error("Error fetching BTC balance:", balanceErr);
        setBalance("0");
        setStatus("Wallet connected, but failed to fetch balance.");
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
      setStatus("Error connecting wallet: " + err.message);
    }
  };

  // Switch account from wallet page
  const handleSwitchAccount = async (index) => {
    try {
      const switchedAccount = await switchAccount(index);
      contextSwitchAccount(switchedAccount); // Update context
      const bal = await getBTCBalance();
      setBalance(bal);
      setStatus(`Switched to account: ${switchedAccount.address}`);
    } catch (err) {
      console.error("Error switching account:", err);
      setStatus("Failed to switch account: " + err.message);
    }
  };

  return (
    <div className="container">
      <h1>Wallet</h1>
      {status && <p className="status">{status}</p>}

      {!walletConnected && (
        <div>
          <p>No wallet connected. Click below to connect:</p>
          <button onClick={handleConnect}>Connect Wallet</button>
        </div>
      )}

      {walletConnected && activeAccount && (
        <div>
          <p>
            <strong>Connected Account:</strong> {activeAccount?.name} ({activeAccount?.address})
          </p>
          <p>
            <strong>BTC Balance:</strong> {balance} BTC
          </p>

          {accountsList.length > 1 && (
            <>
              <h3>Other Accounts:</h3>
              <ul>
                {accountsList
                  .filter(acc => acc.address !== activeAccount.address)
                  .map((acc, idx) => (
                    <li key={idx}>
                      {acc.name} ({acc.address}){" "}
                      <button onClick={() => handleSwitchAccount(idx)}>Switch</button>
                    </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletPage;
