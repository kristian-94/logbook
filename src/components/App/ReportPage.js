import React, {useEffect, useState} from 'react';
import { withAuthorization } from '../Session';
import Sidebar from "../Navigation/sidebar";
import {Container, Row, Col } from "react-bootstrap";
import * as ROUTES from "../../constants/routes";
import ReportBlankPage from "./ReportBlankPage"
import SingleReportPage from "./SingleReportPage";
import * as ROLES from "../../constants/roles";

const ReportPage = ({firebase}) => {
    const [reset, setReset] = useState(false);
    const [adminUsers, setAdminUsers] = useState([]);

    const clientIDinurl = window.location.pathname.split('report/').pop();

    let noClientSelected = false;
    if (window.location.pathname === ROUTES.REPORT) {
        noClientSelected = true;
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
                        <Sidebar resetPage={resetPage} adminusers={adminUsers}  />
                    </Col>
                    <Col xs={10}>
                        {noClientSelected && <ReportBlankPage/>}
                        {!noClientSelected && <SingleReportPage clientID={clientIDinurl} firebase={firebase} resetPage={reset} />}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
const condition = authUser => !!authUser;
export default withAuthorization(condition)(ReportPage);
