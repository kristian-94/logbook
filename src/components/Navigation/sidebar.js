import React, {useEffect, useState, useRef} from "react";
import {Nav} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import {withFirebase} from "../Firebase";
import * as ROUTES from "../../constants/routes";

const Sidebar = ({firebase, resetPage}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientList, setClientList] = useState([]);

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

    const history = useHistory();

    const onClientChanged = (client) => {
        let section = ROUTES.CLIENTS;
        if (window.location.pathname.substr(0, ROUTES.REPORT.length) === ROUTES.REPORT) {
            section = ROUTES.REPORT;
        }
        history.push(section + "/" + client.clientID);
        resetPage();
    }
    const onAddNewClientClicked = (client) => {
        history.push("/clients/new");
    }
    return (
        <>
            <Nav className="col-md-12 d-none d-md-block bg-light sidebar"
                 activeKey="/home"
                 onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <div className="sidebar-sticky"/>
                {clientList && clientList.map(client => {
                    return (
                        <Nav.Item key={client.clientID}>
                            <Nav.Link onClick={() => onClientChanged(client)}>{client.name}</Nav.Link>
                        </Nav.Item>
                    );
                })}
                <Nav.Item>
                    <Nav.Link onClick={() => onAddNewClientClicked()}>
                        Add new client
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </>
    );
};
export default withFirebase(Sidebar);
