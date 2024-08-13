const initialState = {
    clients: null,
    projects: null,
    prestations: null,
    techniciens: null,
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return {
                ...state,
                clients: action.payload.clients,
                projects: action.payload.projects,
                prestations: action.payload.prestations,
                techniciens: action.payload.techniciens,
            };
        case 'CLEAR_DATA':
            return {
                ...state,
                clients: null,
                projects: null,
                prestations: null,
                techniciens: null,
            };
        default:
            return state;
    }
};

export default dataReducer;