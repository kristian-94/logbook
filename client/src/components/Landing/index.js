import React from 'react';
import { useSelector } from 'react-redux';
import * as ROUTES from "../../constants/routes";
import {useHistory} from "react-router-dom";

const Landing = () => {
    const history = useHistory();
    const authUser = useSelector(state => state.auth.currentUser);

    if (authUser.role === 3 || authUser.role === 1) {
        return <Auth authUser={authUser}/>;
    }

    if (window.location.pathname === ROUTES.LANDING) {
        history.push(ROUTES.SIGN_IN);
    }
    return <NonAuth/>;
};

export default Landing;

const NonAuth = () => {
  return (
    <div className="text-center mt-2">
      <h4>Please sign in</h4>
    </div>
  );
};

const Auth = ({ authUser }) => {
  return (
    <div className="text-center mt-5">
      <h1>Hello <strong>{authUser.username}</strong></h1>
      <h5>Use the <div className="btn btn-success">Green</div> links at the top to view client hours logbook information.</h5>
      {authUser.role === 3 && <h5>Use the <div className="btn btn-danger">Red</div> links to enter data since you are an admin.</h5>}
      <h4>Enjoy!</h4>
    </div>
  );
};
