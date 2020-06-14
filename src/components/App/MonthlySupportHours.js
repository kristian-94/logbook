import React from 'react';

const MonthlySupportHours = ({clientData}) => {
    return (
        <div>
            {clientData.monthlysupport && <h5>{clientData.name} has {clientData.monthlysupport} monthly support hours.</h5>}
            {!clientData.monthlysupport && <h5>{clientData.name} has no monthly support hours.</h5>}
        </div>
    );
}
export default MonthlySupportHours;
