import React, {useEffect, useState} from 'react';
import * as ROLES from "../../constants/roles";
import Tooltip from "rc-tooltip/es";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLevelDownAlt, faLevelUpAlt} from "@fortawesome/free-solid-svg-icons";
import SweetAlert from "react-bootstrap-sweetalert";
import {useDispatch, useSelector} from "react-redux";
import * as authActions from "../../store/actions/Auth";

const AdminPage = () => {
    const dispatch = useDispatch();
    const adminUsers = useSelector(state => state.auth.adminUsers);
    const allUsers = useSelector(state => state.auth.users);
    const [loading, setLoading] = useState(false);
    const [basicUsers, setBasicUsers] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (allUsers.length === 0) {
            dispatch(authActions.fetchUsers());
        }
        setBasicUsers(allUsers.filter((user) => user.role !== 3));
        setLoading(false);
    }, [dispatch, allUsers]);

    return (
        <div className="col-md-10 text-center">
            <h1>Admin Users (Read and write access)</h1>
            {loading && <div>Loading ...</div>}
            <UserList users={adminUsers} promote={false}/>
            <h1>Basic Users (Read only access)</h1>
            <UserList users={basicUsers} promote={true} />
        </div>
    );
}

const UserList = ({ users, promote}) => {
    const dispatch = useDispatch();
    const [confirmModal, setConfirmModal] = useState(null);

    const giveNewRole = async (id, newRole) => {
        await dispatch(authActions.updateRole(id, newRole));
        console.log('Changed role of user with id: ' + id + " to have role " + newRole);
        setConfirmModal(null);
    }

    const onClickAction = (id, newRole, alertType) => {
        if (alertType === 'giveAdmin') {
            const modal = (
                <SweetAlert
                    success
                    showCancel
                    confirmBtnText="Yes"
                    confirmBtnBsStyle="success"
                    title="Are you sure?"
                    onConfirm={() => giveNewRole(id, newRole)}
                    onCancel={() => setConfirmModal(null)}
                    focusCancelBtn={false}
                    focusConfirmBtn={false}
                >
                    This will make this user an admin.
                </SweetAlert>
            );
            setConfirmModal(modal);
        } else {
            const modal = (
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Yes"
                    confirmBtnBsStyle="warning"
                    title="Are you sure?"
                    onConfirm={() => giveNewRole(id, newRole)}
                    onCancel={() => setConfirmModal(null)}
                    focusCancelBtn={false}
                    focusConfirmBtn={false}
                >
                    This will remove this user as an admin.
                </SweetAlert>
            );
            setConfirmModal(modal);
        }
    }

    if (!users) {
        return (
            <h5>No users in this category</h5>
        );
    }

    return (
        <div>
            {confirmModal}
            <table className="table">
                <thead className="theat-dark">
                <tr>
                    <th scope="col">UserId</th>
                    <th scope="col">Email</th>
                    <th scope="col">Username</th>
                    <th scope="col">Action</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.username}</td>
                        {!promote && (
                            <td>
                                <Tooltip
                                    placement="right"
                                    mouseEnterDelay={0.5}
                                    mouseLeaveDelay={0.1}
                                    trigger="hover"
                                    overlay={<div>Demote</div>}
                                >
                                    <button onClick={() => onClickAction(user.id, ROLES.BASIC, 'removeAdmin')} className="btn btn-secondary m-1" type="submit">
                                        <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faLevelDownAlt} />
                                    </button>
                                </Tooltip>
                            </td>
                        )}
                        {promote &&
                        <td>
                            <Tooltip
                                placement="right"
                                mouseEnterDelay={0.5}
                                mouseLeaveDelay={0.1}
                                trigger="hover"
                                overlay={<div>Promote</div>}
                            >
                                <button onClick={() => onClickAction(user.id, ROLES.ADMIN, 'giveAdmin')} className="btn btn-secondary m-1" type="submit">
                                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faLevelUpAlt} />
                                </button>
                            </Tooltip>
                        </td>
                        }
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
export default (AdminPage);
