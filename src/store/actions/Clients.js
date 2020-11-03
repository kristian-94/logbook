import {BACKEND_URL} from '../../constants/AppConstants'
import axios from 'axios';
import * as config from '../../constants/AppConstants'
import * as ROUTES from "../../constants/routes";
import history from "../../components/Navigation/History";
export const SET_CLIENTDATA = 'SET_CLIENTDATA';
export const FETCH_CLIENT = 'FETCH_CLIENT';

export const getAuthConfig = (unencoded_token, content = true) => {
    const access_token = Buffer.from(`${unencoded_token}:''`, 'utf8').toString('base64');
    let authconfig = config.CONFIG_JSON_CONTENT;
    if (config === false) {
        authconfig = config.CONFIG_JSON;
    }
    authconfig.headers.Authorization = 'Basic ' + access_token;
    return authconfig;
}
// Here we fetch all high level client data and put that into our redux state.
export const fetchClients = () => {
    return async (dispatch, getState) => {
        const authconfig = getAuthConfig(getState().auth.currentUser.access_token);
        const response = await axios.get(BACKEND_URL + 'clients', authconfig);
        if (response.status !== 200) {
            throw new Error('Didnt get 200 response when fetching clients');
        }
        dispatch({type: SET_CLIENTDATA, clients: response.data});
    };
}

// Client Actions.
// Here we fetch all individual client data from each table and put that into our redux state.
export const fetchClient = (clientid) => {
    console.log('fetching client data all again for client ' + clientid)
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token, false);
        // Collect all data to do with this client.
        const responseClient = await axios.get(BACKEND_URL + 'clients/' + clientid, authConfig);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when fetching clients');
        }
        dispatch({type: FETCH_CLIENT, activeClient: responseClient.data.client})
    };
}

export const updateClient = (clientid, clientData) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const responseClient = await axios.put(BACKEND_URL + 'clients/' + clientid, clientData, authConfig);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when updating client ');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid))
    };
}

export const deleteClient = (clientid) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const responseClient = await axios.delete(BACKEND_URL + 'clients/' + clientid, authConfig);
        if (responseClient.status !== 204) {
            throw new Error('Didnt get 204 response when deleting client ');
        }
        // Updated in backend. Fetch all client data again.
        history.push(ROUTES.CLIENTADMIN);
        window.location.reload(); // That's nasty.. proabaly not using history properly here.
    };
}

export const createClient = (name) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const clientdata = {
            name: name,
        }
        const responseClient = await axios.post(BACKEND_URL + 'clients', clientdata, authConfig);
        if (responseClient.status !== 201) {
            throw new Error('Didnt get 201 response when creating client ');
        }
        history.push(ROUTES.CLIENTADMIN + '/' + responseClient.data.id);
        window.location.reload(); // That's nasty.. proabaly not using history properly here.
    };
}

// Bucket Actions.
export const createBucket = (clientid, newbucketname) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const data = {
            clientid: clientid,
            name: newbucketname,
        };
        const responseClient = await axios.post(BACKEND_URL + 'buckets', data, authConfig);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when creating bucket, got: ' + responseClient.status);
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid));
    };
}

export const deleteBucket = (bucket) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const responseClient = await axios.delete(BACKEND_URL + 'buckets/' + bucket.id, authConfig);
        if (responseClient.status !== 204) {
            throw new Error('Didnt get 204 response when updating bucket name');
        }
        dispatch(fetchClient(bucket.clientid));
    };
}

export const updateBucket = (bucket, data) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const responseClient = await axios.put(BACKEND_URL + 'buckets/' + bucket.id, data, authConfig);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when updating bucket name');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(bucket.clientid));
    };
}

export const addCommunication = (communications, newcommtext, date) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const clientid = getState().clients.activeClient.id;
        const data = {
            note: newcommtext,
            date: date,
            clientid: clientid,
        };
        const responseClient = await axios.post(BACKEND_URL + 'communications', data, authConfig);
        if (responseClient.status !== 201) {
            throw new Error('Didnt get 201 response when creating communication record');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid));
    };
}

export const deleteCommunication = (communications, commid) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const clientid = getState().clients.activeClient.id;
        const responseClient = await axios.delete(BACKEND_URL + 'communications/' + commid, authConfig);
        if (responseClient.status !== 204) {
            throw new Error('Didnt get 204 response when deleting communication record');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid));
    };
}

// Hours/Months Actions.
export const updateHoursData = (hoursid, column, newvalue) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const clientid = getState().clients.activeClient.id;
        let data = {};
        data[column] = newvalue;
        const responseClient = await axios.put(BACKEND_URL + 'hours/' + hoursid, data, authConfig);
        if (responseClient.status !== 200) {
            throw new Error('Didnt get 200 response when updating an hours record');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(clientid))
    };
}

export const deleteMonth = (hoursrecord) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const clientid = getState().clients.activeClient.id;
        const responseClient = await axios.delete(BACKEND_URL + 'hours/' + hoursrecord.id, authConfig);
        if (responseClient.status !== 204) {
            throw new Error('Didnt get 204 response when updating bucket name');
        }
        dispatch(fetchClient(clientid));
    };
}

export const createMonth = (bucket, date) => {
    return async (dispatch, getState) => {
        const authConfig = getAuthConfig(getState().auth.currentUser.access_token);
        const data = {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            bucketid: bucket.id,
            in: 0,
            out: 0,
            touched: 0,
        };
        const responseClient = await axios.post(BACKEND_URL + 'hours', data, authConfig);
        if (responseClient.status !== 201) {
            throw new Error('Didnt get 201 response when creating an hours record');
        }
        // Updated in backend. Fetch all client data again.
        dispatch(fetchClient(bucket.clientid));
    };
}
