import React from 'react';
import {useHistory} from "react-router-dom";
import * as ROUTES from "../../constants/routes";

const SignOutButton = () => {
    const history = useHistory();

    const backToSignIn = () => {
        history.push(ROUTES.SIGN_IN);
    }
    const signOut = () => {
        // firebase.doSignOut().then(() => {
        //     backToSignIn();
        // });
    }

    return (
        <button className="btn btn-warning" type="button" onClick={signOut}>
            Sign Out
        </button>
    )
};
export default (SignOutButton);
