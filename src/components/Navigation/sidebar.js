import React, {useEffect, useState} from "react";
import {Nav} from "react-bootstrap";
import { withRouter } from "react-router";
import { useHistory } from "react-router-dom";

const Side = props => {
    const [clientList, setClientList] = useState([]);

    useEffect(() => {
        const clients = [
            {
                'name': 'cqu',
                'id': '1'
            },
            {
                'name': 'monash',
                'id': '2'
            },
            {
                'name': 'latrobe',
                'id': '3'
            }
        ];
        setClientList(clients);
    }, []);

    const history = useHistory();

    const onClientClicked = (client) => {
        history.push("/clients/" + client.id);
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
                        <Nav.Item key={client.id}>
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
export default Sidebar

