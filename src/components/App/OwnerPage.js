import React, {useEffect, useRef, useState} from 'react';
import { withAuthorization } from '../Session';
import {Container} from "react-bootstrap";
import * as ROLES from '../../constants/roles'
import {SortClientList, GetAdminUsersFromObject} from "./LibFunctions";

const OwnerPage = ({firebase}) => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const [clientData, setClientData] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);

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
                //let allBuckets = [];
                const clientsList = Object.keys(clientsObject)
                    .map(key => ({
                        ...clientsObject[key],
                        clientID: key,
                    }));
                setClientData(SortClientList(clientsList));
            }
        });
        firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            setAdminUsers(GetAdminUsersFromObject(usersObject));
        });
    }, [firebase]);

    if (clientData.length === 0 || adminUsers.length === 0) {
        return (
            <div>
                Loading client owners page
            </div>
        )
    }
    return (
        <div>
            <Container fluid>
                <table className="table w-50">
                    <thead className="theat-dark">
                        <tr>
                            <th scope="col">Client</th>
                            <th scope="col">Owner</th>
                        </tr>
                    </thead>
                    <tbody>
                    {clientData.map(client => {
                        let user = 'No owner';
                        const founduser = adminUsers.find(user => user.uid === client.owner);
                        if (founduser !== undefined) {user = founduser.username}
                        return (
                            <tr key={client.clientID}>
                                <td>{client.name}</td>
                                <td>{user}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </Container>
        </div>
    );
};
// role-based authorization
const condition = authUser => {
    if (authUser.roles === undefined) {
        return false;
    }
    return authUser.roles[ROLES.BASIC] === ROLES.BASIC || authUser.roles[ROLES.ADMIN] === ROLES.ADMIN;
};
export default withAuthorization(condition)(OwnerPage);
