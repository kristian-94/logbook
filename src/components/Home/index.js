import React from 'react';
import { withAuthorization } from '../Session';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import * as ROUTES from '../../constants/routes';
import NewClientForm from "../App/NewClientPage";

const ClientPage = () => {

    let newClient = false;
    if (window.location.pathname === ROUTES.CLIENTS + ROUTES.NEW) {
        newClient = true;
    }
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar />
                    </Col>
                    {newClient && <NewClientForm/>}
                    {!newClient && <div>this could be a client or nothing</div> }
                </Row>
            </Container>
        </div>
    );
};
const condition = authUser => !!authUser;
export default withAuthorization(condition)(ClientPage);
