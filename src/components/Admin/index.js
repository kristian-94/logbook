import React, {Component, useState} from 'react';
import * as ROLES from "../../constants/roles";
import Tooltip from "rc-tooltip/es";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLevelDownAlt, faLevelUpAlt} from "@fortawesome/free-solid-svg-icons";
import SweetAlert from "react-bootstrap-sweetalert";
import {withAuthorization} from "../Session";
class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            adminUsers: [],
            basicUsers: [],
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            const adminUsers = usersList.filter(user => {
                return user.roles[ROLES.ADMIN] === ROLES.ADMIN;
            });
            const basicUsers = usersList.filter(user => {
                return user.roles[ROLES.BASIC] === ROLES.BASIC;
            });

            this.setState({
                adminUsers: adminUsers,
                basicUsers: basicUsers,
                loading: false,
            });
        });
    }
    componentWillUnmount() {
        this.props.firebase.users().off();
    }
    render() {
        const { adminUsers, basicUsers, loading } = this.state;
        return (
            <div className="col-md-10 text-center">
                <h1>Admin Users</h1>
                {loading && <div>Loading ...</div>}
                <UserList users={adminUsers} promote={false} firebase={this.props.firebase}/>
                <h1>Basic Users</h1>
                <UserList users={basicUsers} promote={true} firebase={this.props.firebase} />
            </div>
        );
    }
}

const UserList = ({ users, promote, firebase }) => {
    const [confirmModal, setConfirmModal] = useState(null);

    const makeAdmin = (uid) => {
        const roles = {};
        roles[ROLES.ADMIN] = ROLES.ADMIN;
        firebase.user(uid).update({roles}).then(r => console.log('Made user an admin with uid: ' + uid));
        setConfirmModal(null);
    }
    const removeAdmin = (uid) => {
        const roles = {};
        roles[ROLES.BASIC] = ROLES.BASIC;
        firebase.user(uid).update({roles}).then(r => console.log('Made user basic with uid: ' + uid));
        setConfirmModal(null);
    }

    const onClickAction = (uid) => {
        if (promote) {
            const modal = (
                <SweetAlert
                    success
                    showCancel
                    confirmBtnText="Yes"
                    confirmBtnBsStyle="success"
                    title="Are you sure?"
                    onConfirm={() => makeAdmin(uid)}
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
                    onConfirm={() => removeAdmin(uid)}
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
                    <tr key={user.uid}>
                        <td>{user.uid}</td>
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
                                    <button onClick={() => onClickAction(user.uid)} className="btn btn-secondary m-1" type="submit">
                                        <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faLevelDownAlt} />
                                    </button>
                                </Tooltip>
                            </td>
                        )}
                        {promote && <td>
                            <Tooltip
                                placement="right"
                                mouseEnterDelay={0.5}
                                mouseLeaveDelay={0.1}
                                trigger="hover"
                                overlay={<div>Promote</div>}
                            >
                                <button onClick={() => onClickAction(user.uid)} className="btn btn-secondary m-1" type="submit">
                                    <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faLevelUpAlt} />
                                </button>
                            </Tooltip>
                        </td>}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
// role-based authorization
const condition = authUser => {
    if (authUser.roles === undefined) {
        return false;
    }
    if (authUser.roles[ROLES.ADMIN] === undefined) {
        return false;
    }
    return authUser.roles[ROLES.ADMIN] === 'ADMIN';
};
export default withAuthorization(condition)(AdminPage);
