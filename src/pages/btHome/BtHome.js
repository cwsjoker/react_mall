import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import $home_api from '../../fetch/api/home';
import $user_api from '../../fetch/api/user';
import Cookie from 'js-cookie';
import { getQueryString } from '../../utils/operLocation.js'
import '../../assets/style/bthome.scss';

const BtHome = class BtHome extends Component {
    constructor() {
        super();
        this.state = {
            businessToday: 0,
            distributableProfit: 0,
            turnover: 0,
            estimateEachProfit: 0,
            my_bt_blance: 0,
            my_bt_earnings: 0
        }
    }
    async componentDidMount() {
        const query_obj = getQueryString(this.props.location.search);
        if (query_obj.token) {
            Cookie.set('token', query_obj.token, { expires: 1 });
        }


        const sale_res = await $home_api.selectsale({producerId: 2});
        if (sale_res) {
            this.setState({
                ...sale_res.data.data
            })
        }

        // 有token为登录状态
        if (Cookie.get('token')) {
            const finance_res = await $user_api.getUserFinance({coinSymbol: 'BT'})
            if (finance_res) {
                this.setState({
                    my_bt_blance: finance_res.data.data.available,
                    my_bt_earnings: finance_res.data.data.profit
                })
            }
        }
    }
    render() {
        const { businessToday, distributableProfit, turnover, estimateEachProfit, my_bt_blance, my_bt_earnings } = this.state;
        return (
            <div className="bthome-page">
                <div className="bthome-banner">
                    <div className="bthome-banner-box">
                        <div className="day-business">
                            <p>今日营业</p>
                            <p>（USDT）</p>
                            <p>{businessToday || 0}</p>
                        </div>
                        <div className="tip"></div>
                        <div className="day-distribution">
                            <p>今日可分配利润（USDT）</p>
                            <p>{distributableProfit || 0}</p>
                        </div>
                        <Link className="goto-home-btn" to={'/storeIndex?id=2'}>进入商城</Link>
                    </div>
                </div>
                <div className="bthome-main-box">
                    <div className="bthome-main">
                        <div className="con-title">
                            <p>全球首个数字资产及跨境电商交易平台</p>
                            <p>BT</p>
                            <p>（Bttmall Token）</p>
                        </div>
                        <div className="bt-info-item">
                            <div>
                                <div>
                                    <p>总流通BT</p>
                                    <p>{turnover || 0}BT</p>
                                    {/* <p>(已销毁3244.12BT)</p> */}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>每个BT预计收益</p>
                                    <p>{estimateEachProfit || 0}USDT</p>
                                </div>
                            </div>
                        </div>
                        <div className="bt-info-item">
                            <div>
                                <div>
                                    <p>我的BT</p>
                                    <p>{my_bt_blance || 0}BT</p>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <p>已收益</p>
                                    <p>{my_bt_earnings || 0}USDT</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default BtHome;