import React from 'react';
import * as ROLES from "../../constants/roles";
import {AuthUserContext} from "../Session";
const Landing = () => {
    return (
        <AuthUserContext.Consumer>
            {authUser => {
                if (authUser === null) {
                    return <NonAuth />
                }
                if (authUser.roles[ROLES.ADMIN] || authUser.roles[ROLES.BASIC]) {
                    return <Auth authUser={authUser} />
                }
                return <NonAuth />
            }}
        </AuthUserContext.Consumer>
    )
};
export default Landing;

const NonAuth = () => {
    return (
        <div className="text-center mt-2">
            <h1>Sign in</h1>
        </div>
    );
}

const Auth = ({authUser}) => {
    return (
        <div className="text-center mt-5">
            <h1>Hello <strong>{authUser.username}</strong></h1>
            <h5>Use the links at the top to view client hours information.</h5>
        </div>
    );
}
