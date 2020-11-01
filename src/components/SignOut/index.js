import React from 'react';
import {useHistory} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import * as authActions from "../../store/actions/Auth";
import {useDispatch} from "react-redux";

const SignOutButton = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const signOut = async () => {
        await dispatch(authActions.signOut());
        history.push(ROUTES.SIGN_IN);
        window.location.reload();
    }

    return (
        <button className="btn btn-warning" type="button" onClick={signOut}>
            Sign Out
        </button>
    )
};
export default (SignOutButton);
