import React, { Component } from 'react';
import { connect } from 'react-redux'
import { setLoginState, setShopCartNum, setPageName } from './store/actionCreators'

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
        let { dispatch, location } = this.props;
        // 每次刷新页面验证token
        if (Cookie.get('token')) {
            $user_api.queryUserByToken().then(res => {
                if (res) {
                    const { data } = res.data;
                    dispatch(setLoginState(data, true));
                    Cookie.set('token', Cookie.get('token'), { expires: 1 });
                }
            });
        } else {
            // console.log(this.props);
            // const { location } = this.props.history;
            // if (location.pathname === '/confirmOrder') {
            //     this.props.history.push('/');
            // }
        }

        // 设置title
        switch(location.pathname) {
            case '/shopcart':
                document.title = '购物车';
                dispatch(setPageName('购物车'));
                break;
            case '/myOrder':
                document.title = '我的订单';
                dispatch(setPageName('我的订单'));
                break;
            default:
                document.title = '商城';
                dispatch(setPageName('商城'));
                break;       
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