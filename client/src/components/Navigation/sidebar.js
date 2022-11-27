import React, {useEffect, useRef, useState} from "react";
import {Dropdown, DropdownButton, Nav} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {NOOWNER} from "../../constants/names";
import {useSelector} from 'react-redux';
import { BallTriangle } from 'react-loader-spinner'

const Sidebar = () => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const [filterUserId, setFilterUser] = useState();
  const clientList = useSelector(state => state.clients.clients);
  const adminUsers = useSelector(state => state.auth.adminUsers);

  // Need this to do a ComponentWillUnmount and cleanup memory leaks.
  useEffect(() => {
    let filterUser = localStorage.getItem('filterUserId');
    if (filterUser !== undefined && filterUser !== null && filterUser !== '') {
      // Make sure the id is an int.
      if (filterUser !== NOOWNER) {
        filterUser = parseInt(filterUser);
      }
      setFilterUser(filterUser);
    }
    // ComponentWillUnmount in Class Component
    return () => {
      _isMounted.current = false;
    }
  }, []);

  const Filter = () => {
    const onFilterClicked = (id) => {
      localStorage.setItem('filterUserId', id);
      setFilterUser(id);
    }
    return (
      <DropdownButton id="dropdown-basic-button" variant="secondary" className="m-3 text-center" title="Filter by owner" size="sm">
        <Dropdown.Item onClick={() => onFilterClicked('')}>
          Reset
        </Dropdown.Item>
        <Dropdown.Divider/>
        {adminUsers && adminUsers.map(user => (
          <Dropdown.Item key={user.id} onClick={() => onFilterClicked(user.id)}>
            {user.username}
          </Dropdown.Item>
        ))}
        <Dropdown.Item onClick={() => onFilterClicked(NOOWNER)}>
          No owner
        </Dropdown.Item>
      </DropdownButton>
    );
  };

  const filteringText = () => {
    if (filterUserId === NOOWNER) {
      return (
        <div className="text-center">
          <em>Clients with no owner</em>
        </div>
      );
    }
    if (adminUsers.length === 0) {
      return true;
    }
    const filteredUser = adminUsers.filter(user => user.id === filterUserId)[0];
    if (!filteredUser) {
      return true;
    }
    return (
      <div className="text-center">
        <em>Filtering by {filteredUser.username}</em>
      </div>
    );
  }

  const history = useHistory();

  // This function tells us which 'section' we're in, admin, viewing, or reports.
  const getSection = () => {
    let section = ROUTES.CLIENTS;
    if (window.location.pathname.substr(0, ROUTES.REPORT.length) === ROUTES.REPORT) {
      section = ROUTES.REPORT;
    }
    if (window.location.pathname.substr(0, ROUTES.CLIENTADMIN.length) === ROUTES.CLIENTADMIN) {
      section = ROUTES.CLIENTADMIN;
    }
    return section;
  }

  const onClientChanged = (client) => {
    history.push(getSection() + "/" + client.id);
  }

  const onViewAllClientsAndOwners = () => {
    history.push(ROUTES.OWNERS);
  }
  const onAddNewClientClicked = () => {
    history.push(ROUTES.CLIENTADMIN + "/new");
  }
  const AddNewClientLink = () => {
    return (
      <Nav.Item>
        <Nav.Link onClick={() => onAddNewClientClicked()}>
          Add new client
        </Nav.Link>
      </Nav.Item>
    );
  }
  return (
    <>
      <Nav className="col-sm-12 d-md-block bg-light sidebar"
           activeKey="/home"
           onSelect={selectedKey => alert(`selected ${selectedKey}`)}
      >
        <Filter/>
        {filterUserId && filteringText()}
        <hr/>
        <div className="sidebar-sticky"/>
        {clientList.length === 0 && <BallTriangle height={100} width={100} radius={5} color="#4fa94d" ariaLabel="ball-triangle-loading" wrapperClass="" wrapperStyle="" visible={true}/>}
        {clientList && clientList.filter(client => {
          if (filterUserId === NOOWNER) {
            // Return clients that don't have an owner set.
            return client.ownerid === null || client.ownerid === undefined;
          }
          if (filterUserId) {
            return client.ownerid === filterUserId;
          }
          return true;
        }).map(client => {
          return (
            <Nav.Item key={client.id}>
              <Nav.Link onClick={() => onClientChanged(client)}>{client.name}</Nav.Link>
            </Nav.Item>
          );
        })}
        <Nav.Item>
          <Nav.Link onClick={() => onViewAllClientsAndOwners()}>All clients and owners</Nav.Link>
        </Nav.Item>
        {getSection() === ROUTES.CLIENTADMIN && <AddNewClientLink/>}
      </Nav>
    </>
  );
};
export default Sidebar;
