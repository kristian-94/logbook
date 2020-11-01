import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
export const SET_USERDATA = 'SET_USERDATA';
export const SIGNED_IN = 'SIGNED_IN';

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
// Here we log in, and get back our token if successful.
export const signIn = (email, password) => {
    return async (dispatch) => {
        try {
            let config = {
                headers: {
                    Accept: 'application/json',
                }
            }
            const data = {
                email: email,
                password: password
            }
            const response = await axios.post(BACKEND_URL + 'user/login', data, config);
            if (response.status !== 200) {
                throw new Error('Didnt get 200 response when signing in');
            }
            if (response.data.success === false) {
                throw new Error(response.data.message);
            }
            dispatch({type: SIGNED_IN, data: response.data});
        }
        catch (err) {
            // Send to analytics server or handle.
            throw err;
        }
    };
}
