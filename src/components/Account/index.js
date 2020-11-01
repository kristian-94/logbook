import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <h1>Account: {authUser.email}</h1>
                <div className="text-center">
                    <hr/>
                </div>
            </div>
        )}
    </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
