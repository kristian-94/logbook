import React, {useEffect, useState} from 'react';
import { withAuthorization } from '../Session';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from '../../constants/routes';
import NewClientForm from "./NewClientPage";
import SingleClientPage from "./SingleClientPage";
import ClientBlankPage from "./ClientBlankPage";
import * as ROLES from "../../constants/roles";

const ClientPage = ({firebase}) => {
    const [reset, setReset] = useState(false);
    const [adminUsers, setAdminUsers] = useState([]);

    const clientIDinurl = window.location.pathname.split(ROUTES.CLIENTADMIN + '/').pop();
    let newClient = false;
    let noClient = false;
    if (window.location.pathname === ROUTES.CLIENTADMIN + ROUTES.NEW) {
        newClient = true;
    }
    if (window.location.pathname === ROUTES.CLIENTADMIN) {
        noClient = true;
    }

    const resetPage = () => {
        setReset(!reset);
    }

    useEffect(() => {
        firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            const adminUsers = usersList.filter(user => {
                return user.roles[ROLES.ADMIN] === ROLES.ADMIN;
            });
            setAdminUsers(adminUsers);
        });
    }, [firebase]);

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar resetPage={resetPage} adminusers={adminUsers} />
                    </Col>
                    <Col xs={10}>
                        {noClient && <ClientBlankPage type={'enter'} />}
                        {newClient && <NewClientForm/>}
                        {!newClient && !noClient && <SingleClientPage firebase={firebase} clientID={clientIDinurl} resetPage={reset} adminusers={adminUsers}/> }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
// role-based authorization
const condition = authUser => {
    if (authUser === null || authUser.roles === undefined) {
        return false;
    }
    if (authUser.roles[ROLES.ADMIN] === undefined) {
        return false;
    }
    return authUser.roles[ROLES.ADMIN] === 'ADMIN';
};
export default withAuthorization(condition)(ClientPage);
