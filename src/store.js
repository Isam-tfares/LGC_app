// src/store.js
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import userReducer from './reducers/userReducer'; // Update path as needed
import dataReducer from './reducers/dataReducer';

const rootReducer = combineReducers({
    user: userReducer,
    data: dataReducer,
});

const store = createStore(rootReducer);

export default store;
