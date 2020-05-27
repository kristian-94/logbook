import React, {useEffect, useState, useRef} from "react";
import {Nav} from "react-bootstrap";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";
import {withFirebase} from "../Firebase";

const Side = ({firebase}) => {
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
                clientsList.sort((client1, client2) => client1['name'] > client2['name']);
                console.log(clientsList);
                setClientList(clientsList);
            }
        });
    }, [firebase]);

    const history = useHistory();

    const onClientClicked = (client) => {
        history.push("/clients/" + client.clientID);
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
                            <Nav.Link onClick={() => onClientClicked(client)}>{client.name}</Nav.Link>
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
const Sidebar = withRouter(Side);

export default withFirebase(Sidebar);
