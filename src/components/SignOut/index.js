import React from 'react';
import { withFirebase } from '../Firebase';
const SignOutButton = ({ firebase }) => (
    <button className="btn btn-warning" type="button" onClick={firebase.doSignOut}>
        Sign Out
    </button>
);
export default withFirebase(SignOutButton);
