import React, {useEffect, useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Sidebar from "../Navigation/sidebar";
import ClientBlankPage from "./ClientBlankPage";
import * as ROUTES from "../../constants/routes";
import SingleClientReadOnlyPage from "./SingleClientReadOnlyPage";
import * as ROLES from "../../constants/roles";
import {useDispatch, useSelector} from 'react-redux';
import * as clientActions from '../../store/actions/Clients';
import * as authActions from '../../store/actions/Auth';


// Display all the client information in a non editable way.
const ClientReadOnlyPage = ({firebase}) => {
    const [reset, setReset] = useState(false);
    const dispatch = useDispatch();

    const clientIDinurl = window.location.pathname.split(ROUTES.CLIENTS + '/').pop();
    let noClient = false;
    if (window.location.pathname === ROUTES.CLIENTS) {
        noClient = true;
    }

    const resetPage = () => {
        setReset(!reset);
    }

    useEffect(() => {
        dispatch(clientActions.fetchClients());
        dispatch(authActions.fetchUsers());
    }, [dispatch]);

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar resetPage={resetPage} />
                    </Col>
                    <Col xs={10}>
                        {noClient && <ClientBlankPage type={'view'} />}
                        {!noClient && <SingleClientReadOnlyPage clientID={clientIDinurl} resetPage={reset}/> }
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default ClientReadOnlyPage;
