import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
import {getAuthConfig} from './Clients';
export const SET_USERDATA = 'SET_USERDATA';
export const SIGNED_IN = 'SIGNED_IN';
export const SIGNED_OUT = 'SIGNED_OUT';

// Here we fetch all user data and put that into our redux state.
export const fetchUsers = () => {
    return async (dispatch, getState) => {
        const authconfig = getAuthConfig(getState().auth.currentUser.access_token);
        const response = await axios.get(BACKEND_URL + 'users', authconfig);
        if (response.status !== 200) {
            throw new Error('Didnt get 200 response when fetching users');
        }
        dispatch({type: SET_USERDATA, users: response.data})
    };
}
// Here we log in, and get back our token if successful.
export const signIn = (email, password) => {
    return async (dispatch) => {
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
    };
}
export const signOut = () => {
    return async (dispatch) => {
        dispatch({type: SIGNED_OUT});
    };
}
export const updateRole = (userid, role) => {
    return async (dispatch, getState) => {
        const authconfig = getAuthConfig(getState().auth.currentUser.access_token);
        const data = {
            userid: userid,
            role: role
        };
        const response = await axios.post(BACKEND_URL + 'user/updaterole', data, authconfig);
        if (response.status !== 200) {
            throw new Error('Didnt get 200 response when updating a user role');
        }
        // Get all the user data to update their roles now that one has changed.
        dispatch(fetchUsers());
    };
}
