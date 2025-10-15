import React from 'react';
import '../styles/badges.css';

const BadgeCard = ({ badgeName, unlocked }) => {
    return (
        <div className="card">
            <p>{badgeName}</p>
            <p>{unlocked ? "Unlocked ✅" : "Locked ❌"}</p>
        </div>
    );
};

export default BadgeCard;
