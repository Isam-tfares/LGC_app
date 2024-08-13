export const setData = (clients, projects, prestations, techniciens) => ({
    type: 'SET_DATA',
    payload: { clients, projects, prestations, techniciens },
});

export const clearData = () => ({
    type: 'CLEAR_DATA',
});

