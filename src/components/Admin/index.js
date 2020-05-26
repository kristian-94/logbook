import React, { Component } from 'react';
import { withFirebase } from '../Firebase';
class AdminPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
        };
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            console.log(usersObject);
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));

            this.setState({
                users: usersList,
                loading: false,
            });
        });
    }
    componentWillUnmount() {
        this.props.firebase.users().off();
    }
    render() {
        const { users, loading } = this.state;
        return (
            <div className="col-md-10 text-center">
                <h1>List of users in this site</h1>
                {loading && <div>Loading ...</div>}
                <UserList users={users} />
            </div>
        );
    }
}
const UserList = ({ users }) => (
    <table className="table">
        <thead className="theat-dark">
        <tr>
            <th scope="col">UserId</th>
            <th scope="col">Email</th>
            <th scope="col">Username</th>
        </tr>
        </thead>
        <tbody>
        {users.map(user => (
            <tr key={user.uid}>
                <td>{user.uid}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
            </tr>
        ))}
        </tbody>
    </table>
);
export default withFirebase(AdminPage);
