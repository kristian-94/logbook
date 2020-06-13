import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as NAMES from '../../constants/names';
import { AuthUserContext } from '../Session';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

const Navigation = () => (
    // Here can probably make different auth navigations for different roles.
    // Eg. NavigationAuthAdmin, NavigationAuthHailey etc.
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? <NavigationAuth /> : <NavigationNonAuth />
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = () => (
    <Navbar bg="primary" variant="dark">
        <Navbar.Brand to="/">{NAMES.SITENAME}</Navbar.Brand>
        <Nav className="mr-auto">
            <Link className="btn btn-primary" to={ROUTES.CLIENTS}>
                Clients
            </Link>
            <Link className="btn btn-primary" to={ROUTES.REPORT}>
                Reports
            </Link>
        </Nav>
        <Link className="btn btn-primary" to={ROUTES.ADMIN}>
            Admin
        </Link>
        <Link className="btn btn-primary" to={ROUTES.ACCOUNT}>
            Account
        </Link>
        <SignOutButton />
    </Navbar>
);
const NavigationNonAuth = () => (
    <Navbar bg="primary" variant="dark">
        <Navbar.Brand to="/">{NAMES.SITENAME}</Navbar.Brand>
        <Nav className="mr-auto">
            <Link className="btn btn-primary" to={ROUTES.LANDING}>
                Landing
            </Link>
            <Link className="btn btn-primary" to={ROUTES.SIGN_IN}>
                Sign In
            </Link>
        </Nav>
    </Navbar>
);
export default Navigation;
