const initialState = {
    user: null,
    token: null,
    logined: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGOUT':
            return {
                ...state,
                logined: false,
                user: null,
                token: null,
            };
        case 'SET_USER':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                logined: true,
            };
        case 'CLEAR_USER':
            return {
                ...state,
                user: null,
                token: null,
            };
        default:
            return state;
    }
};

export default userReducer;
