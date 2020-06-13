import React from 'react';
import { withAuthorization } from '../Session';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from '../../constants/routes';
import NewClientForm from "./NewClientPage";
import SingleClientPage from "./SingleClientPage";

const ClientPage = ({firebase}) => {
    const clientIDinurl = window.location.pathname.split('clients/').pop();
    let newClient = false;
    if (window.location.pathname === ROUTES.CLIENTS + ROUTES.NEW) {
        newClient = true;
    }

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar/>
                    </Col>
                    <Col xs={10}>
                        {newClient && <NewClientForm/>}
                        {!newClient && <SingleClientPage firebase={firebase} clientID={clientIDinurl}/> }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
const condition = authUser => !!authUser;
export default withAuthorization(condition)(ClientPage);
