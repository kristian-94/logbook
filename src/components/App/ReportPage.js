import React from 'react';
import { withAuthorization } from '../Session';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from "../../constants/routes";
import ReportBlankPage from "./ReportBlankPage"
import SingleReportPage from "./SingleReportPage";

const ReportPage = ({firebase}) => {
    const clientIDinurl = window.location.pathname.split('report/').pop();

    let noClientSelected = false;
    if (window.location.pathname === ROUTES.REPORT) {
        noClientSelected = true;
    }

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar />
                    </Col>
                    <Col xs={10}>
                        {noClientSelected && <ReportBlankPage/>}
                        {!noClientSelected && <SingleReportPage clientID={clientIDinurl} firebase={firebase} />}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
const condition = authUser => !!authUser;
export default withAuthorization(condition)(ReportPage);
