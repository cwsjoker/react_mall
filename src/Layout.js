import React, { Component } from 'react';
import { connect } from 'react-redux'
import { setLoginState, setShopCartNum } from './store/actionCreators'

// 头部
import Header from './components/Header.js';
// 尾部
import Footer from './components/Footer.js';
// 路由
import Routers from './router/index.js';


import Cookie from 'js-cookie';
import $user_api from './fetch/api/user'

const Layout = class Layout extends Component {
    componentDidMount() {
        let { dispatch } = this.props;
        // 每次刷新页面验证token
        if (Cookie.get('token')) {
            $user_api.queryUserByToken().then(res => {
                if (res) {
                    const { data } = res.data;
                    dispatch(setLoginState(data, true));
                    Cookie.set('token', Cookie.get('token'), { expires: 1 });
                }
            });
        }

        // 购物车
        const list = JSON.parse(localStorage.getItem('shopCartList'));
        if (list) {
            dispatch(setShopCartNum(list.length));
        }
    }
    render() {
        return (
            <div className="App">
                <Header />
                <Routers />
                <Footer />
            </div>
        )
    }
}

export default connect()(Layout);