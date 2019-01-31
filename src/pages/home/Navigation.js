import React, { Component } from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { setSoreId } from '../../store/actionCreators';

import $home_api from '../../fetch/api/home.js'

const Navigation = class Navigation extends Component {
    constructor() {
        super();
        this.state = {
            storeList: []
        }
    }
    componentDidMount() {
        // console.log(this);
        $home_api.getStoreMenu().then(res => {
            if (res) {
                this.setState({
                    storeList: res.data.data
                })
            }
        })
    }
    // 跳转商店
    gotoStoreList(item, e) {
        e.preventDefault();
        this.props.history.push('/storeIndex?id='+item.producerId);
    }
    render() {
        return (
            <div className="navigation-main">
                <h2>货币类型</h2>
                <ul className="currencyType">
                {
                    this.state.storeList.map(item => {
                        return (
                            <li key={item.producerId} onClick={this.gotoStoreList.bind(this, item)} className={this.props.storeIndex == item.producerId ? 'on' : '' }>
                                <i></i>
                                <a href="javascript:;">
                                    <h3><img src={item.logo} /><span>{item.NAME}</span></h3>
                                    <div className="progressBarDiv">
                                        <div className="progress_container">
                                            {
                                                item.percent * 100 < 80 ? (
                                                    <div className="progress_bar tip greed" style={{width: item.percent * 100 + '%'}}></div>
                                                ) : (
                                                    <div className="progress_bar tip red" style={{width: item.percent * 100 + '%'}}></div>
                                                )
                                            }
                                        </div>
                                        <span>{item.percent * 100}%</span>
                                    </div>
                                </a>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { navStore: state.nav }
}

export default withRouter(connect(mapStateToProps)(Navigation));