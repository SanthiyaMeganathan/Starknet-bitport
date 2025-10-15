import React from 'react';
import Lottie from 'lottie-react';
import '../styles/lottieAnimation.css';

const LottieAnimation = ({ animationData, loop = true }) => {
    return (
        <div style={{ width: 150, height: 150 }}>
            <Lottie animationData={animationData} loop={loop} />
        </div>
    );
};

export default LottieAnimation;
