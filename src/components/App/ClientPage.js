import React, {useEffect} from 'react';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from '../../constants/routes';
import NewClientForm from "./NewClientPage";
import SingleClientPage from "./SingleClientPage";
import ClientBlankPage from "./ClientBlankPage";
import * as clientActions from "../../store/actions/Clients";
import * as authActions from "../../store/actions/Auth";
import {useDispatch} from "react-redux";

const ClientPage = () => {
    const dispatch = useDispatch();
    const clientIDinurl = window.location.pathname.split(ROUTES.CLIENTADMIN + '/').pop();
    let newClient = false;
    let noClient = false;
    if (window.location.pathname === ROUTES.CLIENTADMIN + ROUTES.NEW) {
        newClient = true;
    }
    if (window.location.pathname === ROUTES.CLIENTADMIN) {
        noClient = true;
    }
    console.log('rendering client page')

    useEffect(() => {
        dispatch(clientActions.fetchClients());
        dispatch(authActions.fetchUsers());
    }, [dispatch]);

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar />
                    </Col>
                    <Col xs={10}>
                        {noClient && <ClientBlankPage type={'enter'} />}
                        {newClient && <NewClientForm/>}
                        {!newClient && !noClient && <SingleClientPage clientID={clientIDinurl} /> }
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default ClientPage;
