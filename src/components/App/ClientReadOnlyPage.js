import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Sidebar from "../Navigation/sidebar";
import ClientBlankPage from "./ClientBlankPage";
import {withAuthorization} from "../Session";
import * as ROUTES from "../../constants/routes";
import SingleClientReadOnlyPage from "./SingleClientReadOnlyPage";
import * as ROLES from "../../constants/roles";


// Display all the client information in a non editable way.
const ClientReadOnlyPage = ({firebase}) => {
    const [reset, setReset] = useState(false);
    const [adminUsers, setAdminUsers] = useState([]);

    const clientIDinurl = window.location.pathname.split(ROUTES.CLIENTS + '/').pop();
    let noClient = false;
    if (window.location.pathname === ROUTES.CLIENTS) {
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
                        {noClient && <ClientBlankPage type={'view'} />}
                        {!noClient && <SingleClientReadOnlyPage firebase={firebase} clientID={clientIDinurl} resetPage={reset} adminusers={adminUsers} /> }
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(ClientReadOnlyPage);
