import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router';
import { getQueryString } from '../utils/operLocation.js'
import { setLoginState } from '../store/actionCreators'
import Cookie from 'js-cookie'
import $user_api from '../fetch/api/user'
import Recommend from './home/Recommend.js'
import Navigation from './home/Navigation.js'

const Home = class Home extends Component {
    constructor() {
        super();
        this.state = {
            name: 'home'
        }
    }
    componentDidMount() {
        // 先获取搜索参数token
        const query_obj = getQueryString(this.props.location.search);
        if (query_obj.token) {
            Cookie.set('token', query_obj.token, { expires: 1 });
        }
        // $user_api.queryUserByToken().then(res => {
        //     if (res) {
        //         let { dispatch } = this.props;
        //         const { data } = res.data;
        //         dispatch(setLoginState(data, true));
        //     }
        // });
        this.props.history.push('storeIndex?id=3')
    }
    render() {
        return (
            <div className="home-main">
                {/* <div className="home-main-nav">
                    <Navigation />
                </div>
                <div className="home-main-con">
                    <Recommend />
                </div> */}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { navStore: state.nav }
}

export default withRouter(connect(mapStateToProps)(Home));