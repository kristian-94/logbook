import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Sidebar from '../Navigation/sidebar';
import ClientBlankPage from './ClientBlankPage';
import * as ROUTES from '../../constants/routes';
import SingleClientReadOnlyPage from './SingleClientReadOnlyPage';
import { useDispatch } from 'react-redux';
import * as clientActions from '../../store/actions/Clients';
import * as authActions from '../../store/actions/Auth';

// Display all the client information in a non editable way.
const ClientReadOnlyPage = () => {
  const dispatch = useDispatch();
  const clientIDinurl = window.location.pathname.split(ROUTES.CLIENTS + '/').pop();
  let noClient = false;
  if (window.location.pathname === ROUTES.CLIENTS) {
    noClient = true;
  }

  useEffect(() => {
    dispatch(clientActions.fetchClients());
    dispatch(authActions.fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <Container fluid>
        <Row className="mainRow">
          <Col xs={5} md={2} sm={3} id="sidebar-wrapper">
            <Sidebar/>
          </Col>
          <Col style={{overflow: 'scroll', minWidth: '1100px'}} xs={5} md={10} sm={9} >
            {noClient && <ClientBlankPage type={'view'}/>}
            {!noClient && <SingleClientReadOnlyPage clientID={clientIDinurl}/>}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClientReadOnlyPage;
