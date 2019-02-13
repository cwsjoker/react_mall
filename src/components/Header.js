import React, { Component } from 'react';
import { connect } from 'react-redux'
import Cookie from 'js-cookie';
import { setLoginState } from '../store/actionCreators';

const Header = class Header extends Component {
    logout = (e) => {
        e.preventDefault();
        Cookie.remove('token');
        this.props.dispatch(setLoginState('', false));
    }
    render() {
        let btn = null;
        let btn_mining = null;
        if (this.props.loginStore.login) {
            btn = (
                <div>
                    <span>您好{this.props.loginStore.name}</span>
                    <a href="#" onClick={this.logout} style={{marginLeft: '10px'}}>退出</a>
                    <i></i>
                    <a href="./myOrder" >我的订单</a>
                </div>
            )
            btn_mining = (
                <a href="./mining">
                    <div className="mining-btn fr">挖矿<span></span> </div>
                </a>
            )
        } else {
            btn = (
                <div>
                    <a href="http://47.52.202.171/login" style={{marginRight: '5px'}}>请登录</a>
                    <a href="http://47.52.202.171/register">免费注册</a>
                </div>
            )
        }

        return (
            <div className="header-main">
                <div className="top">
                    <div className="top-main">
                        {btn}
                    </div>
                </div>
                <div className="bottom">
                    <div className="nav-main">
                        <a href="./">
                            <div className="logo-img"></div>
                        </a>
                        <span>{this.props.homeStore.name}</span>
                    </div>
                    <div className="nav-end">
                        {btn_mining}
                        <div className="shopCart-logo">
                            <a href="./shopcart">
                                <span>购物车<em>{this.props.shopCartStore.num}</em></span>
                            </a>
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