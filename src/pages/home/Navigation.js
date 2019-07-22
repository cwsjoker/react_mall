import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import $home_api from '../../fetch/api/home.js'
import CountDown from '../../components/CountDown';
import { symbolImg } from '../../utils/operation.js';

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
                let list = res.data.data;
                list.forEach(v => {
                    if (!v.open) {
                        const d1 = new Date(v.systemTime);
                        const d2 = new Date(v.openTime);
                        const diff_count = parseInt(d2 - d1) / 1000;
                        v.diff_count = diff_count;
                    }
                })
                this.setState({
                    storeList: list
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
                                {
                                    item.open ? (
                                        <Link to={'/storeIndex?id=' + item.producerId} style={{'textDecoration': 'none'}}>
                                            <h3><img src={symbolImg(item.symbol.toLowerCase())} alt="" /><span>{item.NAME}</span></h3>
                                            {/* <div className="progressBarDiv">
                                                {
                                                    <div className="progress">
                                                        <div className="progress-bar progress-bar-striped active" style={{width: item.percent * 100 + '%', backgroundColor: item.percent * 100 >= 80 ? '#d9534f' : '#5cb85c'}}></div>
                                                    </div>
                                                }
                                                <span style={{color: item.percent * 100 >= 80 ? '#d9534f' : '#5cb85c'}}>{(item.percent * 100).toFixed(2)}%</span>
                                            </div> */}
                                        </Link>
                                    ) : (
                                        // <Link to="/" onClick={(e) => e.preventDefault()}>
                                        //     <h3><img src={item.logo} alt="" /><span>{item.NAME}</span></h3>
                                        //     <CountDown
                                        //         discount={item.diff_count}
                                        //     />
                                        // </Link>
                                        <div>
                                            <h3><img src={item.logo} alt="" /><span>{item.NAME}</span></h3>
                                            <CountDown
                                                discount={item.diff_count}
                                            />
                                        </div>
                                    )
                                }
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