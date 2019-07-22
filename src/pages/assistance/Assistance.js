import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Spin, Empty, message } from 'antd';
import Footer from '../../components/Footer.js';
import $home_api from '../../fetch/api/home.js';
import Cookie from 'js-cookie';
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas';
import { secondToDateMin } from '../../utils/operation';

import '../../assets/style/assistance.scss';

const Assistance = class Assistance extends Component {
    constructor() {
        super()
        this.state = {
            share_link: '',
            cumulativeCommission: 0,
            inviterNumber: 0,
            list: [
                // {
                //     miningDate: '20123-322=2',
                //     inviterProfit: '21321',
                //     mining: '22321'
                // }, {
                //     miningDate: '20123-322=2',
                //     inviterProfit: '21321',
                //     mining: '22322'
                // }, {
                //     miningDate: '20123-322=2',
                //     inviterProfit: '21321',
                //     mining: '22323'
                // }
            ],
            modal_show: false,
            speed_obj: {}
        }
    }
    async componentDidMount() {
        const  link_code = Cookie.get('promoterCode') !== 'null' ? Cookie.get('promoterCode') : '';
        this.setState({
            share_link: window.BT_URL + 'register?promoterCode=' + link_code
        }, () => {
            new QRCode(document.getElementById("qrcode"), {
                text: this.state.share_link,
                width: 130,
                height: 130,
            })
        })

        const res = await $home_api.getBoostAction();
        if (res) {
            // console.log(res);
            this.setState({
                cumulativeCommission: res.data.data.cumulativeCommission,
                inviterNumber: res.data.data.inviterNumber,
                list: res.data.data.inviterProfitMiningFlowList
            })
        }

        this.getMiningSpeed();

    }
    // 查询挖矿速率
    async getMiningSpeed() {
        const res = await $home_api.miningSpeed();
        if (res) {
            this.setState({
                speed_obj: res.data.data
            })
        }
    }
    // 复制链接
    copyRecommend(e) {
        e.preventDefault();
        const recommendCode = document.getElementById("recommendCode");
        recommendCode.select();
        document.execCommand("Copy");
        message.success('复制成功', 1);
    }
    // 打开分享弹窗
    openModal() {
        this.setState({modal_show: true}, () => {
            new QRCode(document.getElementById("qrcode_modal"), {
                text: this.state.share_link,
                width: 100,
                height: 100,
            })

            // setTimeout(() => {
            //     // 转化为图片
            //     html2canvas(document.querySelector("#assistance_modal_html")).then((canvas) => {
            //         let imgData = canvas.toDataURL()
            //         let img = document.createElement('img')
            //         img.src = imgData
            //         document.querySelector('#assistance_modal').appendChild(img);
            //     });
            // }, 5000)
        })
    }
    render() {
        const { share_link, list, cumulativeCommission, inviterNumber, modal_show, speed_obj } = this.state;
        return (
            <div className="assistance-page">
                <div className="header-assistance">
                    <div className="header-assistance-main">
                        <Link to="./"><div></div></Link>
                        <div>助力</div>
                    </div>
                </div>
                <div className="assistance-top">
                    <div className="assistance-top-main">
                        <div className="qrcode-img-box" id="qrcode"></div>
                        <button className="share-link-btn" onClick={this.openModal.bind(this)}>点击分享</button>
                        <div className="tip-txt-box">
                            <h5>温馨提示:</h5>
                            <p>1.邀请人和被邀请人都不必进行KYC认证</p>
                            <p>2.好友助力加速：每邀请一个好友购买商品可加速28.8分钟(每个人总共可以获得十次助力加速,总加速288分钟),可以缩短投资周期</p>
                            <p>3.好友购物分利：邀请好友购物可以获得购物分利,直接推荐人：订单金额*平台利润率*10%,间接推荐人：订单金额*平台利润率*5%</p>
                            <p>4.如有任何恶意刷币行为，一经查实所得奖励将不予兑现，BTTMALL对邀请活动保留最终解释权。</p>
                            <p>5.好友购物分利永久有效不限次数</p>
                            <p>*该活动的最终解释权为BTTMALL所有*</p>
                        </div>
                    </div>
                </div>
                <div className="assistance-bottom">
                    <div className="link-box">
                        <div className="link-box-main">
                            <div>
                                <span>我的邀请方式：</span>
                                <input id="recommendCode" readOnly="readOnly" value={share_link} />
                            </div>
                            <div onClick={this.copyRecommend.bind(this)}>复制链接</div>
                        </div>
                    </div>
                    <div className="data-list-box">
                        <div className="assistance-info">
                            <div>
                                <div>推广人数</div>
                                <div>{inviterNumber}</div>
                            </div>
                            <div>
                                <div>推广收益</div>
                                <div>{cumulativeCommission} USDT</div>
                            </div>
                        </div>
                        <div className="assistance-list-title">推广收益</div>
                        <div className="assistance-list-body">
                            <div className="list-header">
                                <span>时间</span>
                                <span>邀请人</span>
                                <span>奖励</span>
                            </div>
                            {
                                list.length !== 0 ? <ul className="list-body">
                                        {
                                            list.map(item => {
                                                return (
                                                    <li key={item.mining}>
                                                        <span>{item.miningDate}</span>
                                                        <span>{item.inviter}</span>
                                                        <span>{item.mining} USDT</span>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul> : <Empty description={'暂无数据'} />

                            }
                        </div>
                        <div className="list-pagination">
                            {/* <Pagination current={current} onChange={this.changePage} total={total} showTotal={total => `共 ${total} 数据`} /> */}
                        </div>
                    </div>
                </div>
                {/* 弹窗 */}
                {
                    modal_show ? <div className="assistance-cover" onClick={() => this.setState({modal_show: false})}></div> : null
                }
                {
                    modal_show ? (
                        <div className="assistance-modal" id="assistance_modal">
                            <div className="assistance-modal-html" id="assistance_modal_html">
                                <div className="assistance-modal-main">
                                    <h5>全球首个数字资产交易及跨境电商创新交易平台</h5>
                                    <div className="modal-bg"></div>
                                    <div className="modal-img" id="qrcode_modal"></div>
                                    <div className="modal-txt">扫一扫邀请好友助力</div>
                                    <div className="modal-intro">
                                        <div>初始产出速率：<span>24小时<em></em></span></div>
                                        <div>当前产出速率：<span>{speed_obj.currentMiningRate ?　secondToDateMin(speed_obj.currentMiningRate) : '24小时'}<em></em></span></div>
                                        <div>可以加速产出：<span>{speed_obj.allowSpeedDuration ? secondToDateMin(speed_obj.allowSpeedDuration) : '4.8小时'}<em></em></span></div>
                                        <div>每邀请一个好友购买商品可加速<span>28.8分钟</span></div>
                                        <div>（每个人总共可以获得十次助力加速，总加速288分钟）</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
                {/* 尾部 */}
                <Footer />
            </div>
        )
    }
}

export default Assistance;