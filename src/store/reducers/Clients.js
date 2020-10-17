import {FETCH_CLIENT, SET_CLIENTDATA} from '../actions/Clients';

const initialState = {
    clients: [],
    activeClient: {},
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_CLIENTDATA:
            return {
                ...state,
                clients: action.clients,
            };
        case FETCH_CLIENT:
            return {
                ...state,
                activeClient: action.activeClient,
            };
    }
    return state;
}
