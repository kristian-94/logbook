import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
export const SET_USERDATA = 'SET_USERDATA';
export const SIGNED_IN = 'SIGNED_IN';
export const SIGNED_OUT = 'SIGNED_OUT';

// Here we fetch all user data and put that into our redux state.
export const fetchUsers = () => {
    return async (dispatch, getState) => {
        const unencoded_token = getState().auth.currentUser.access_token;
        const access_token = Buffer.from(`${unencoded_token}:''`, 'utf8').toString('base64');
        // Execute any async code before dispatching the action.
        let config = {
            headers: {
                Accept: 'application/json',
                Authorization: "Basic " + access_token,
            }
        }
        const response = await axios.get(BACKEND_URL + 'users', config);
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
