const initialState = {
    clients: null,
    projects: null,
    phases: null,
    materiaux: null,
    types_beton: null,
    natures_echantillon: null,
    interventions: null,
};


const receptionDataReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_RECEPTION_DATA':
            return {
                ...state,
                clients: action.payload.clients,
                projects: action.payload.projects,
                phases: action.payload.phases,
                materiaux: action.payload.materiaux,
                types_beton: action.payload.types_beton,
                natures_echantillon: action.payload.natures_echantillon,
                interventions: action.payload.interventions,
            };
        case 'CLEAR_RECEPTION_DATA':
            return {
                ...state,
                clients: null,
                projects: null,
                phases: null,
                materiaux: null,
                types_beton: null,
                natures_echantillon: null,
                interventions: null,
            };
        case 'CLEAR_INTERVENTIONS':
            return {
                ...state,
                interventions: null,
            };
        default:
            return state;
    }
};

export default receptionDataReducer;