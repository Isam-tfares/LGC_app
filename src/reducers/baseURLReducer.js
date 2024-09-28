// src/reducers/baseURLReducer.js
import { SET_BASE_URL } from '../actions/baseURLActions';

const initialState = {
    baseURL: '',
};

const baseURLReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_BASE_URL:
            return {
                ...state,
                baseURL: action.payload,
            };
        default:
            return state;
    }
};

export default baseURLReducer;
