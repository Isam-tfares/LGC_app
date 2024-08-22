export const setReceptionData = (clients, projects, phases, materiaux, types_beton, natures_echantillon, interventions) => ({
    type: 'SET_RECEPTION_DATA',
    payload: { clients, projects, phases, materiaux, types_beton, natures_echantillon, interventions },
});

export const clearReceptionData = () => ({
    type: 'CLEAR_RECEPTION_DATA',
});

