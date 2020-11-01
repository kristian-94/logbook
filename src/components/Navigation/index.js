import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as NAMES from '../../constants/names';
import * as ROLES from '../../constants/roles';
import { AuthUserContext } from '../Session';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

// Here can probably make different auth navigations for different roles.
// Eg. NavigationAuthAdmin, NavigationAuthHailey etc.
const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser => {
            if (authUser === null) {
                return <NavigationNonAuth />
            }
            if (authUser.role === 3) {
                return <NavigationAdminAuth authUser={authUser} />
            }
            if (authUser.role === 1) {
                return <NavigationBasicAuth authUser={authUser} />
            }
            return <NavigationNonAuth />
        }}
    </AuthUserContext.Consumer>
);

const NavigationAdminAuth = () => {
    return (
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand to="/">{NAMES.SITENAME}</Navbar.Brand>
            <Nav className="mr-auto">
                <Link className="btn btn-danger ml-1 mr-1" to={ROUTES.CLIENTADMIN}>
                    Client Admin
                </Link>
                <Link className="btn btn-success ml-1 mr-1" to={ROUTES.CLIENTS}>
                    View Clients
                </Link>
                <Link className="btn btn-success ml-1 mr-1" to={ROUTES.REPORT}>
                    Reports
                </Link>
                <Link className="btn btn-success ml-1 mr-1" to={ROUTES.SUMMARY}>
                    Client Summary
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
    )};
const NavigationBasicAuth = ({ authUser }) => (
    <Navbar bg="primary" variant="dark">
        <Navbar.Brand to="/">{NAMES.SITENAME}</Navbar.Brand>
        <Nav className="mr-auto">
            <Link className="btn btn-success ml-1 mr-1" to={ROUTES.CLIENTS}>
                Clients
            </Link>
            <Link className="btn btn-success ml-1 mr-1" to={ROUTES.REPORT}>
                Reports
            </Link>
            <Link className="btn btn-success ml-1 mr-1" to={ROUTES.SUMMARY}>
                Client Summary
            </Link>
        </Nav>
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
