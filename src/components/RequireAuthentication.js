import React, { Component } from 'react';
import Cookie from 'js-cookie';
import TipLogin from '../components/TipLogin.js';
function requireAuthentication(WrapComponent) {
    return class AuthenticatedComponent extends Component {
        constructor() {
            super()
            this.state = {
                login: false
            }
        }
        componentDidMount() {
            if (Cookie.get('token')) {
                this.setState({
                    login: true
                })
            }
        }
        render() {
            if (this.state.login) {
                return <WrapComponent />
            } else {
                return <TipLogin />;
            }
        }
    }
}

export default requireAuthentication;