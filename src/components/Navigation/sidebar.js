import React, {useEffect, useState, useRef} from "react";
import {Nav, DropdownButton, Dropdown} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import {NOOWNER} from "../../constants/names";
import {useSelector} from 'react-redux';

const Sidebar = ({resetPage}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [filterUserId, setFilterUser] = useState('');
    const clientList = useSelector(state => state.clients.clients);
    const adminUsers = useSelector(state => state.auth.adminUsers);

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);

    const Filter = () => {
        const onFilterClicked = (id) => {
            setFilterUser(id);
        }
        return (
            <DropdownButton id="dropdown-basic-button" variant="secondary" className="m-3 text-center" title="Filter by owner" size="sm">
                <Dropdown.Item onClick={() => onFilterClicked('')} >
                    Reset
                </Dropdown.Item>
                <Dropdown.Divider />
                {adminUsers && adminUsers.map(user => (
                    <Dropdown.Item key={user.id} onClick={() => onFilterClicked(user.id)} >
                        {user.username}
                    </Dropdown.Item>
                ))}
                <Dropdown.Item onClick={() => onFilterClicked(NOOWNER)} >
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
        const filteredUser = adminUsers.filter(user => user.id === filterUserId)[0];
        return (
            <div className="text-center">
                <em>Filtering by {filteredUser.username}</em>
            </div>
        );
    }

    const history = useHistory();

    const onClientChanged = (client) => {
        let section = ROUTES.CLIENTS;
        if (window.location.pathname.substr(0, ROUTES.REPORT.length) === ROUTES.REPORT) {
            section = ROUTES.REPORT;
        }
        if (window.location.pathname.substr(0, ROUTES.CLIENTADMIN.length) === ROUTES.CLIENTADMIN) {
            section = ROUTES.CLIENTADMIN;
        }
        history.push(section + "/" + client.id);
        resetPage();
    }

    const onViewAllClientsAndOwners = (client) => {
        history.push(ROUTES.OWNERS);
    }

    return (
        <>
            <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
                 activeKey="/home"
                 onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <Filter />
                {filterUserId && filteringText()}
                <hr/>
                <div className="sidebar-sticky"/>
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
            </Nav>
        </>
    );
};
export default Sidebar;
