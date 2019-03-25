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
                // res.data.data[0]['percent'] = 0.22
                // res.data.data[1]['percent'] = 0.83
                // res.data.data[2]['percent'] = 0.45
                // res.data.data[3]['percent'] = 0.97
                // res.data.data[4]['percent'] = 0.14
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
                            <li key={item.producerId} className={parseInt(storeIndex) === item.producerId ? 'on' : '' }>
                                <i></i>
                                <Link to={'/storeIndex?id=' + item.producerId} style={{'textDecoration': 'none'}}>
                                    <h3><img src={item.logo} alt="" /><span>{item.NAME}</span></h3>
                                    <div className="progressBarDiv">
                                        {/* <div className="progress_container">
                                            {
                                                item.percent * 100 < 80 ? (
                                                    <div className="progress_bar tip greed" style={{width: item.percent * 100 + '%'}}></div>
                                                ) : (
                                                    <div className="progress_bar tip red" style={{width: item.percent * 100 + '%'}}></div>
                                                )
                                            }
                                        </div> */}
                                        {
                                            <div className="progress">
                                                <div className="progress-bar progress-bar-striped active" style={{width: item.percent * 100 + '%', backgroundColor: item.percent * 100 >= 80 ? '#d9534f' : '#5cb85c'}}></div>
                                            </div>
                                        }
                                        <span style={{color: item.percent * 100 >= 80 ? '#d9534f' : '#5cb85c'}}>{(item.percent * 100).toFixed(2)}%</span>
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