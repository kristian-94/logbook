import React from 'react';
import { withAuthorization } from '../Session';
import {useSelector} from "react-redux";

const AccountPage = () => {
    const authUser = useSelector(state => state.auth.currentUser);
    return (
        <div>
            <div className="text-center">
                <h3 className="mt-3">Account: {authUser.email}</h3>
                <hr />
                <h3>Username: {authUser.username}</h3>
                <hr />
                <h3>Role: {authUser.role}</h3>
            </div>
        </div>
    );
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);
