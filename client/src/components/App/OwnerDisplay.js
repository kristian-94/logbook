import React from 'react';
import Tooltip from 'rc-tooltip/es';

const OwnerDisplay = ({ owner }) => {
  if (owner) {
    return (
      <Tooltip
        placement="top"
        mouseEnterDelay={0.5}
        mouseLeaveDelay={0.1}
        trigger="hover"
        overlay={<div>Owner</div>}
      >
        <div className="float-right bg-success p-2 rounded ownerbutton">
          <em>{owner.username}</em>
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      placement="top"
      mouseEnterDelay={0.5}
      mouseLeaveDelay={0.1}
      trigger="hover"
      overlay={<div>Owner</div>}
    >
      <div className="float-right bg-success p-2 rounded ownerbutton">
        <em>No owner</em>
      </div>
    </Tooltip>
  );
};

export default OwnerDisplay;
