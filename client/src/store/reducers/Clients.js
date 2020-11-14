import {FETCH_CLIENT, SET_CLIENT_SUMMARY_DATA, SET_CLIENTDATA, RESET_CLIENTDATA} from '../actions/Clients';

const initialState = {
    clients: [],
    activeClient: {},
    clientSummaryData: [],
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CLIENTDATA:
            return {
                ...state,
                clients: action.clients,
            };
        case SET_CLIENT_SUMMARY_DATA:
            return {
                ...state,
                clientSummaryData: action.clients,
            };
        case FETCH_CLIENT:
            return {
                ...state,
                activeClient: action.activeClient,
            };
        case RESET_CLIENTDATA:
            return initialState;
        default:
            return state;
    }
}
