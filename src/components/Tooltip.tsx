import React from 'react';

const Tooltip: React.FC = () => {
  return (
    <div id="tooltip" className="tooltip">
      <div className="tooltip-simple"></div>
      <div className="tooltip-detailed" style={{ display: 'none' }}>
        <div className="tooltip-info">
          <div className="tooltip-title"></div>
          <div className="tooltip-content"></div>
          <div className="tooltip-properties">
            <ul></ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;