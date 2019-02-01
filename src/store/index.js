import { createStore, combineReducers } from 'redux';

import login from './login';
import shopCart from './shopCart.js';

const store = createStore(combineReducers({
    login,
    shopCart
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

console.log('init store', store.getState());

export default store;