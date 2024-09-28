// src/store.js
import { createStore, combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import receptionDataReducer from './reducers/receptionDataReducer';
import baseURLReducer from './reducers/baseURLReducer'; // Add this

const rootReducer = combineReducers({
    user: userReducer,
    data: dataReducer,
    receptionData: receptionDataReducer,
    baseURL: baseURLReducer, // Add this
});

const store = createStore(rootReducer);

export default store;
