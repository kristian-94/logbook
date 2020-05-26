import React from 'react';
import { withAuthorization } from '../Session';
const ClientPage = () => (
    <div>
        <h1>Client page</h1>
        <p>This page will display our list of clients on the left in a long menu</p>
    </div>
);
const condition = authUser => !!authUser;
export default withAuthorization(condition)(ClientPage);
