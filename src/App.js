import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch }  from 'react-router-dom';
import store from './store/index';

import './assets/style/default.css';
import './assets/style/components.css';
import './assets/style/page.css';


import Layout from './Layout';
import Mining from './pages/mining/Mining';


// import Cookie from 'js-cookie';
// import $user_api from './fetch/api/user'

const App = class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact path="/mining" component={Mining} />
            <Route path="/" component={Layout} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
