import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Link }  from 'react-router-dom';
import Cookie from 'js-cookie';
import { setLoginState } from '../store/actionCreators';

const Header = class Header extends Component {
    logout = (e) => {
        e.preventDefault();
        Cookie.remove('token');
        Cookie.remove('promoterCode');
        this.props.dispatch(setLoginState('', false));
        window.location.href = window.BT_URL + 'logout';
    }
    render() {
        let btn = null;
        let btn_mining = null;
        if (this.props.loginStore.login) {
            btn = (
                <div>
                    <span>您好{this.props.loginStore.name}</span>
                    <a href="volid(0);" onClick={this.logout} style={{marginLeft: '10px'}}>退出</a>
                    <i></i>
                    <Link to="./myOrder" >我的订单</Link>
                </div>
            )
            btn_mining = (
                <Link to="./mining">
                    <div className="mining-btn fr">挖矿<span></span> </div>
                </Link>
            )
        } else {
            btn = (
                <div>
                    <a href={window.BT_URL + 'login?redirectUrl=shop'} style={{marginRight: '5px'}}>请登录</a>
                    <a href={window.BT_URL + 'register'}>免费注册</a>
                </div>
            )
            btn_mining = (
                <Link to="./mining">
                    <div className="mining-btn fr">挖矿<span></span> </div>
                </Link>
            )
        }

        return (
            <div className="header-main">
                <div className="top">
                    <div className="top-main">
                        <a href={window.BT_URL} className="top-left">{`<< 交易所`}</a>
                        {btn}
                    </div>
                </div>
                <div className="bottom">
                    <div className="nav-main">
                        <Link to="./">
                            <div className="logo-img"></div>
                        </Link>
                        <span>{this.props.homeStore.name}</span>
                    </div>
                    <div className="nav-end">
                        {btn_mining}
                        <div className="shopCart-logo">
                            <Link to="./shopcart">
                                <span>购物车<em>{this.props.shopCartStore.num}</em></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return { loginStore: state.login, shopCartStore: state.shopCart, homeStore: state.home }
}

export default connect(mapStateToProps)(Header);