import React, {useEffect, useState} from 'react';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from '../../constants/routes';
import NewClientForm from "./NewClientPage";
import SingleClientPage from "./SingleClientPage";
import ClientBlankPage from "./ClientBlankPage";
import * as clientActions from "../../store/actions/Clients";
import * as authActions from "../../store/actions/Auth";
import {useDispatch, useSelector} from "react-redux";
import SweetAlert from 'react-bootstrap-sweetalert';
import {useHistory} from "react-router-dom";

const ClientPage = () => {
    const [confirmModal, setConfirmModal] = useState(null);
    const [confirmed, setConfirmed] = useState(false);
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.currentUser);
    const activeClient = useSelector(state => state.clients.activeClient);
    const history = useHistory();
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

    const onConfirmEditOtherOwnersClient = () => {
        console.log('confirmed to edit this client, log this?');
        setConfirmed(true);
        setConfirmModal(null);
    }

    const goToReadOnlyPage = () => {
        setConfirmModal(null);
        history.push(ROUTES.CLIENTS + '/' + activeClient.id);
    }

    const modal = (
        <SweetAlert
            warning
            showCancel
            confirmBtnText="Client read only page"
            confirmBtnBsStyle="warning"
            cancelBtnText="Yes, I want to edit"
            title="Are you sure?"
            onCancel={() => onConfirmEditOtherOwnersClient()}
            onConfirm={() => goToReadOnlyPage()}
            focusCancelBtn={false}
            focusConfirmBtn={false}
        >
            You are not the owner of this client. Do you want to edit the data anyway?
        </SweetAlert>
    );

    // First check that we have a currentUser set and an activeclient.
    if (noClient === false && confirmed === false && confirmModal === null && currentUser && Object.keys(activeClient).length !== 0) {
        if (activeClient.ownerid !== currentUser.id && activeClient.ownerid !== null) {
            setConfirmModal(modal);
        }
    }

    return (
        <div>
            {confirmModal}
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
