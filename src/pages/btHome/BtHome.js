import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { Modal } from 'antd';
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
            my_bt_earnings: 0,
            modal_show: false,
            profit_list: []
        }
    }
    async componentDidMount() {

        console.log(this.props)
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
            const [finance_res, profit_res] = await Promise.all([
                $user_api.getUserFinance({coinSymbol: 'BT'}),
                $user_api.getUserBtProfit()
            ])
            // const finance_res = await $user_api.getUserFinance({coinSymbol: 'BT'})
            if (finance_res) {
                this.setState({
                    my_bt_blance: finance_res.data.data.available,
                    my_bt_earnings: finance_res.data.data.profit
                })
            }
            if (profit_res) {
                console.log(profit_res);
                this.setState({
                    profit_list: profit_res.data.data
                })
            }
        }
    }
    render() {
        const { businessToday, distributableProfit, turnover, estimateEachProfit, my_bt_blance, my_bt_earnings, modal_show, profit_list } = this.state;
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
                                    {
                                        this.props.loginStore.login ? <p onClick={() => this.setState({modal_show: true})}>查看收益</p> : null    
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 收益弹窗 */}
                <Modal
                    title={null}
                    visible={modal_show}
                    footer={null}
                    width={722}
                    style={{'top': 200}}
                    onCancel={() => this.setState({modal_show: false})}
                >
                    <div className="bt-profit-modal">
                        <div className="bt-profit-header">我的BT收益明细</div>
                        <div className="bt-profit-list">
                            <div className="bt-profit-list-header">
                                <span>时间</span>
                                <span>类型</span>
                                <span>数量</span>
                                <span>说明</span>
                            </div>
                            <ul className="bt-profit-list-body">
                                {
                                    profit_list.map((item, index) => {
                                        return (
                                            <li key={item.id} className={index % 2 === 0 ? 'bg-gray' : ''}>
                                                <span>{item.miningDate}</span>
                                                <span>{item.type === -2 ? '空投收益' : '邀请收益'}</span>
                                                <span>{item.mining}</span>
                                                <span>{item.remarks}</span>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return { loginStore: state.login }
}


export default connect(mapStateToProps)(BtHome);