import React from 'react';

const MonthlySupportHours = ({clientData}) => {
    return (
        <div>
            {clientData.monthlysupport && <h5>{clientData.monthlysupport}</h5>}
            {!clientData.monthlysupport && <h5>{clientData.name} has no support hours data set.</h5>}
        </div>
    );
}
export default MonthlySupportHours;
