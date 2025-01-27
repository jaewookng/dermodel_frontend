import React from 'react';

interface ResetButtonProps {
    onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
    return (
        <button className="reset-btn" onClick={onReset}>Reset View</button>
    );
}

export default ResetButton;