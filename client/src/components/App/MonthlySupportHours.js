import React from 'react';

const MonthlySupportHours = ({activeClient}) => {
    return (
        <div>
            {activeClient.support && <h5>{activeClient.support}</h5>}
            {!activeClient.support && <h5>{activeClient.name} has no support hours data set.</h5>}
        </div>
    );
}
export default MonthlySupportHours;
