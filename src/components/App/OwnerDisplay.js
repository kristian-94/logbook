import React from 'react';

const OwnerDisplay = ({owner}) => {
    return (
        <div>
            {owner && <h5>{owner} is the owner.</h5>}
            {!owner && <h5>No owner.</h5>}
        </div>
    );
}
export default OwnerDisplay;
