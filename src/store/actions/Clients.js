import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
export const SET_CLIENTDATA = 'SET_CLIENTDATA';
export const FETCH_CLIENT = 'FETCH_CLIENT';

// Here we fetch all high level client data and put that into our redux state.
export const fetchClients = () => {
    return async (dispatch) => {
        // Execute any async code before dispatching the action.
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
    };
}

// Here we fetch all individual client data from each table and put that into our redux state.
export const fetchClient = (clientid) => {
    console.log('fetching client data all again for client ' + clientid)
    return async (dispatch) => {
        // Execute any async code before dispatching the action.
        let config = {
            headers: {
                Accept: 'application/json',
            }
        }
        // Collect all data to do with this client with the default API's.
        const responseClient = await axios.get(BACKEND_URL + 'clients/' + clientid, config);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when fetching clients');
        }
        dispatch({type: FETCH_CLIENT, activeClient: responseClient.data.client})
    };
}

export const updateClientNote = (clientid, clientNote) => {
    return async (dispatch) => {
        // Execute any async code before dispatching the action.
        let config = {
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
            }
        }
        const notedata = {
            note: clientNote
        };
        const responseClient = await axios.put(BACKEND_URL + 'clients/' + clientid, notedata, config);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when fetching clients');
        }

        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid))
    };
}
