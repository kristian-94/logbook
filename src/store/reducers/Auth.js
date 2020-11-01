import {SET_USERDATA} from '../actions/Auth';
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
    }
    return state;
}
