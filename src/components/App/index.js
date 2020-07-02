import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from '../Navigation';

import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import ClientPage from "./ClientPage";
import ClientReadOnlyPage from "./ClientReadOnlyPage";
import PageNotFound from "../Error";
import ReportPage from "./ReportPage";


const App = () => (
    <Router>
        <div>
            <Navigation />
            <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
                <Route exact path={ROUTES.CLIENTADMIN + ROUTES.NEW} component={ClientPage} />
                <Route path={ROUTES.CLIENTADMIN} component={ClientPage} />
                <Route path={ROUTES.CLIENTS} component={ClientReadOnlyPage} />
                <Route path={ROUTES.REPORT} component={ReportPage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />
                <Route path={ROUTES.ADMIN} component={AdminPage} />
                <Route component={PageNotFound} />
            </Switch>
        </div>
    </Router>
);
export default withAuthentication(App);
