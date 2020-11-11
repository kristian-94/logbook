import React, {useEffect, useRef} from 'react';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from "../../constants/routes";
import ReportBlankPage from "./ReportBlankPage"
import SingleReportPage from "./SingleReportPage";
import * as clientActions from "../../store/actions/Clients";
import * as authActions from "../../store/actions/Auth";
import {useDispatch, useSelector} from "react-redux";

const ReportPage = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.auth.currentUser);
    const clientIDinurl = window.location.pathname.split(ROUTES.REPORT + '/').pop();
    const _isMounted = useRef(true); // Initial value _isMounted = true
    let noClientSelected = false;
    if (window.location.pathname === ROUTES.REPORT) {
        noClientSelected = true;
    }
    useEffect(() => {
        // Should only be fetching if we are signed in properly.
        if (currentUser) {
            dispatch(clientActions.fetchClients());
            dispatch(authActions.fetchUsers());
        }
    }, [dispatch, currentUser]);

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">
                        <Sidebar />
                    </Col>
                    <Col xs={10}>
                        {noClientSelected && <ReportBlankPage/>}
                        {!noClientSelected && <SingleReportPage clientID={clientIDinurl} />}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
export default (ReportPage);
