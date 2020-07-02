import React, {useState} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import Sidebar from "../Navigation/sidebar";
import ClientBlankPage from "./ClientBlankPage";
import {withAuthorization} from "../Session";
import * as ROUTES from "../../constants/routes";
import SingleClientReadOnlyPage from "./SingleClientReadOnlyPage";


// Display all the client information in a non editable way.
const ClientReadOnlyPage = ({firebase}) => {
    const [reset, setReset] = useState(false);
    const clientIDinurl = window.location.pathname.split(ROUTES.CLIENTS + '/').pop();
    let noClient = false;
    if (window.location.pathname === ROUTES.CLIENTS) {
        noClient = true;
    }

    const resetPage = () => {
        setReset(!reset);
    }
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar resetPage={resetPage} />
                    </Col>
                    <Col xs={10}>
                        {noClient && <ClientBlankPage />}
                        {!noClient && <SingleClientReadOnlyPage firebase={firebase} clientID={clientIDinurl} resetPage={reset} /> }
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
const condition = authUser => !!authUser;
export default withAuthorization(condition)(ClientReadOnlyPage);
