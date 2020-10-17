import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
export const SET_USERDATA = 'SET_USERDATA';

// Here we fetch all user data and put that into our redux state.
export const fetchUsers = () => {
    return async (dispatch) => {
        // Execute any async code before dispatching the action.
        try {
            let config = {
                headers: {
                    Accept: 'application/json',
                }
            }
            console.log('fetching user data')
            const response = await axios.get(BACKEND_URL + 'users', config);
            if (response.status !== 200) {
                throw new Error('Didnt get 200 response when fetching users');
            }
            dispatch({type: SET_USERDATA, users: response.data})
        }
        catch (err) {
            // Send to analytics server or handle.
            throw err;
        }
    };
}
