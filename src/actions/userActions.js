export const setUser = (user, token) => ({
    type: 'SET_USER',
    payload: { user, token },
});

export const clearUser = () => ({
    type: 'CLEAR_USER',
});

export const logout = () => ({
    type: 'LOGOUT',
});
