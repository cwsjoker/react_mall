import { createStore, combineReducers } from 'redux';

import todos from './todoList';
import login from './login';
import nav from './nav.js';
import shopCart from './shopCart.js';

// 
const store = createStore(combineReducers({
    todos,
    login,
    nav,
    shopCart
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

console.log('init store', store.getState());

export default store;