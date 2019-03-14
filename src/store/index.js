import { createStore, combineReducers } from 'redux';

import home from './home.js';
import login from './login';
import shopCart from './shopCart.js';

const store = createStore(combineReducers({
    login,
    shopCart,
    home
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

// console.log('init store', store.getState());

export default store;