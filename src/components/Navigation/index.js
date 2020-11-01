import React from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as NAMES from '../../constants/names';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {useSelector} from "react-redux";

const Navigation = () => {
    const authUser = useSelector(state => state.auth.currentUser);
    if (authUser === null || authUser === [] || authUser === undefined) {
        return <NavigationNonAuth />
    }
    if (authUser.role === 3) {
        return <NavigationAdminAuth authUser={authUser} />
    }
    if (authUser.role === 1) {
        return <NavigationBasicAuth authUser={authUser} />
    }
    return <NavigationNonAuth />
}

const NavigationAdminAuth = ({authUser}) => {
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
            <Navbar.Brand to="/">You are <strong>{authUser.username}</strong></Navbar.Brand>
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
