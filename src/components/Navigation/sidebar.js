import React, {useEffect, useState, useRef} from "react";
import {Nav, DropdownButton, Dropdown} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {withFirebase} from "../Firebase";
import * as ROUTES from "../../constants/routes";
import {NOOWNER} from "../../constants/names";
import {AuthUserContext} from "../Session";
import * as ROLES from "../../constants/roles";

const Sidebar = ({firebase, resetPage, adminusers}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientList, setClientList] = useState([]);
    const [filterUser, setFilterUser] = useState('');

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);
    useEffect(() => {
        firebase.clients().on('value', snapshot => {
            if (_isMounted.current) { // Check always mounted component, don't change state if not mounted.
                const clientsObject = snapshot.val();
                const clientsList = Object.keys(clientsObject)
                    .map(key => ({
                        ...clientsObject[key],
                        clientID: key,
                    }));
                // Make alphabetical order.
                clientsList.sort((client1, client2) => {
                    const name1 = client1.name.toLowerCase();
                    const name2 = client2.name.toLowerCase();
                    if (name1 < name2) //sort string ascending
                        return -1;
                    if (name1 > name2)
                        return 1;
                    return 0; //default return value (no sorting)
                });
                setClientList(clientsList);
            }
        });
    }, [firebase]);

    const Filter = () => {

        const onFilterClicked = (uid) => {
            setFilterUser(uid);
        }

        return (
            <DropdownButton id="dropdown-basic-button" variant="secondary" className="m-3 text-center" title="Filter by owner" size="sm">
                <Dropdown.Item onClick={() => onFilterClicked('')} >
                    Reset
                </Dropdown.Item>
                <Dropdown.Divider />
                {adminusers && adminusers.map(user => (
                    <Dropdown.Item key={user.uid} onClick={() => onFilterClicked(user.uid)} >
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
        if (filterUser === NOOWNER) {
            return (
                <div className="text-center">
                    <em>Clients with no owner</em>
                </div>
            );
        }
        const filteredUser = adminusers.filter(user => user.uid === filterUser)[0];
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
        history.push(section + "/" + client.clientID);
        resetPage();
    }
    const onAddNewClientClicked = (client) => {
        history.push(ROUTES.CLIENTADMIN+ "/new");
    }

    const AddNewClientLink = () => {
        return (
            <AuthUserContext.Consumer>
                {authUser => {
                    if (authUser.roles[ROLES.ADMIN]) {
                        return (
                            <Nav.Item>
                                <Nav.Link onClick={() => onAddNewClientClicked()}>
                                    Add new client
                                </Nav.Link>
                            </Nav.Item>
                        );
                    }
                    return null;
                }}
            </AuthUserContext.Consumer>
        )
    }

    return (
        <>
            <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
                 activeKey="/home"
                 onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <Filter />
                {filterUser && filteringText()}
                <hr/>
                <div className="sidebar-sticky"/>
                {clientList && clientList.filter(client => {
                    if (filterUser === NOOWNER) {
                        // Return clients that don't have an owner set.
                        return client.owner === null || client.owner === undefined;
                    }
                    if (filterUser) {
                        return client.owner === filterUser;
                    }
                    return true;
                }).map(client => {
                    return (
                        <Nav.Item key={client.clientID}>
                            <Nav.Link onClick={() => onClientChanged(client)}>{client.name}</Nav.Link>
                        </Nav.Item>
                    );
                })}
                <AddNewClientLink />
            </Nav>
        </>
    );
};
export default withFirebase(Sidebar);
