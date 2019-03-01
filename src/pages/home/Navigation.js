import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import $home_api from '../../fetch/api/home.js'

const Navigation = class Navigation extends Component {
    constructor() {
        super();
        this.state = {
            storeList: []
        }
    }
    componentDidMount() {
        $home_api.getStoreMenu().then(res => {
            if (res) {
                this.setState({
                    storeList: res.data.data
                })
            }
        })
    }
    render() {
        const { storeList } = this.state;
        const { storeIndex } = this.props;
        return (
            <div className="navigation-main">
                <h2>货币类型</h2>
                <ul className="currencyType">
                {
                    storeList.map(item => {
                        return (
                            <li key={item.producerId} className={storeIndex == item.producerId ? 'on' : '' }>
                                <i></i>
                                <Link to={'/storeIndex?id=' + item.producerId}>
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
                                        <span>{(item.percent * 100).toFixed(2)}%</span>
                                    </div>
                                </Link>
                            </li>
                        )
                    })
                }
                </ul>
            </div>
        )
    }
}

export default Navigation;