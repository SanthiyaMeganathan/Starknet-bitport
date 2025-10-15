import React, { useContext, useState } from "react";
import "../styles/wallet.css";
import { WalletContext } from "../context/WalletContext";
import { connectWallet, getBTCBalance } from "../services/xverseService";

const WalletPage = () => {
  const {
    walletConnected,
    activeAccount,
    accountsList,
    connectWallet: contextConnect,
  } = useContext(WalletContext);

  const [balance, setBalance] = useState("0");
  const [status, setStatus] = useState("");

  const handleConnect = async () => {
    setStatus("Connecting wallet...");
    try {
      const { currentAccount } = await connectWallet();
      contextConnect(currentAccount);

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
      alert("Wallet connection failed: " + err.message);
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
            <strong>Connected Account:</strong> {activeAccount?.name} (
            {activeAccount?.addresses?.payment})
          </p>
          <p>
            <strong>BTC Balance:</strong> {balance} BTC
          </p>

          <h3>Other Accounts:</h3>
          <ul>
            {accountsList
              .filter((acc) => acc.address !== activeAccount.address)
              .map((acc, idx) => (
                <li key={idx}>
                  {acc.name} ({acc.address})
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WalletPage;
