import React, {useEffect} from 'react';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from '../../constants/routes';
import NewClientForm from "./NewClientPage";
import SingleClientPage from "./SingleClientPage";
import ClientBlankPage from "./ClientBlankPage";
import * as clientActions from "../../store/actions/Clients";
import * as authActions from "../../store/actions/Auth";
import {useDispatch, useSelector} from "react-redux";

const ClientPage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.currentUser);
    const clientIDinurl = window.location.pathname.split(ROUTES.CLIENTADMIN + '/').pop();
    let newClient = false;
    let noClient = false;
    if (window.location.pathname === ROUTES.CLIENTADMIN + ROUTES.NEW) {
        newClient = true;
    }
    if (window.location.pathname === ROUTES.CLIENTADMIN) {
        noClient = true;
    }

    useEffect(() => {
        // Should only be fetching if we are signed in properly.
        if (currentUser) {
            dispatch(clientActions.fetchClients());
            dispatch(authActions.fetchUsers());
        }
    }, [dispatch, currentUser]);

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
