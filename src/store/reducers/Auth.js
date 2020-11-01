import {SET_USERDATA, SIGNED_IN} from '../actions/Auth';
const initialState = {
    users: [],
    adminUsers: [],
    currentUser: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_USERDATA:
            // Add the adminUsers also to a second object for easy querying.
            const admins = action.users.filter((user) => user.role === 3);
            return {
                users: action.users,
                adminUsers: admins,
            };
        case SIGNED_IN:
            // We just signed in so store our token in local storage and in redux state.
            const currentuser = action.data.authUser;
            localStorage.setItem('authUser', JSON.stringify(currentuser));
            return {
                currentUser: currentuser,
            };
    }
    return state;
}
