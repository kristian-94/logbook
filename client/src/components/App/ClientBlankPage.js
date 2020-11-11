import React from 'react';

const ClientBlankPage = ({type}) => {
    return (
        <div>
            <h1>No client selected</h1>
            <h4>Please select a client on the left to {type} month by month hours data.</h4>
        </div>
    )
}
export default ClientBlankPage;
