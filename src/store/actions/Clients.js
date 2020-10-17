import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
export const SET_CLIENTDATA = 'SET_CLIENTDATA';
export const FETCH_CLIENT = 'FETCH_CLIENT';

// Here we fetch all high level client data and put that into our redux state.
export const fetchClients = () => {
    return async (dispatch) => {
        // Execute any async code before dispatching the action.
        try {
            let config = {
                headers: {
                    Accept: 'application/json',
                }
            }
            const response = await axios.get(BACKEND_URL + 'clients', config);
            if (response.status !== 200) {
                throw new Error('Didnt get 200 response when fetching clients');
            }
            dispatch({type: SET_CLIENTDATA, clients: response.data})
        }
        catch (err) {
            // Send to analytics server or handle.
            throw err;
        }
    };
}
// Here we fetch all individual client data from each table and put that into our redux state.
export const fetchClient = (clientid) => {
    return async (dispatch) => {
        // Execute any async code before dispatching the action.
        try {
            let config = {
                headers: {
                    Accept: 'application/json',
                }
            }
            // Collect all data to do with this client with the default API's.
            const responseClient = await axios.get(BACKEND_URL + 'clients?id=' + clientid, config);
            if (responseClient.status !== 200) {
                throw new Error('Didnt get 200 response when fetching clients');
            }
            dispatch({type: FETCH_CLIENT, activeClient: responseClient.data.client})
        }
        catch (err) {
            // Send to analytics server or handle.
            throw err;
        }
    };
}
