import React, {useEffect, useRef} from 'react';
import {Container} from "react-bootstrap";
import {useSelector, useDispatch} from 'react-redux';
import * as clientActions from "../../store/actions/Clients";
import * as authActions from "../../store/actions/Auth";

const OwnerPage = () => {
    const _isMounted = useRef(true); // Initial value _isMounted = true
    const clients = useSelector(state => state.clients.clients);
    const adminUsers = useSelector(state => state.auth.adminUsers);
    const dispatch = useDispatch();

    // Need this to do a componentwillunmount and cleanup memory leaks.
    useEffect(() => {
        // ComponentWillUnmount in Class Component
        return () => {
            _isMounted.current = false;
        }
    }, []);

    useEffect(() => {
        dispatch(clientActions.fetchClients());
        dispatch(authActions.fetchUsers());
    }, [dispatch]);

    if (clients.length === 0 || adminUsers.length === 0) {
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
                    {clients.map(client => {
                        let user = 'No owner';
                        const founduser = adminUsers.find(user => user.id === client.ownerid);
                        if (founduser !== undefined) {user = founduser.username}
                        return (
                            <tr key={client.id}>
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
export default OwnerPage;
