import React from 'react';
import { AuthUserContext, withAuthorization } from '../Session';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <div className="text-center">
                    <h3 className="mt-3">Account: {authUser.email}</h3>
                    <hr/>
                    <h3>Username: {authUser.username}</h3>
                    <hr/>
                    <h3>Role: {authUser.role}</h3>
                </div>
            </div>
        )}
    </AuthUserContext.Consumer>
);
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
