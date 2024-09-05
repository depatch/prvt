import React from 'react';

const Progress: React.FC = () => {
    return (
        <div>
            <progress value="50" max="100"></progress>
            <span>50%</span>
        </div>
    );
};

export default Progress;