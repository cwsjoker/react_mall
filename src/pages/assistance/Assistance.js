import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Pagination, Spin, Empty, message } from 'antd';
import Footer from '../../components/Footer.js';
import $home_api from '../../fetch/api/home.js';
import Cookie from 'js-cookie';
import QRCode from 'qrcodejs2';
import html2canvas from 'html2canvas';

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
            modal_show: false
        }
    }
    async componentDidMount() {
        const  link_code = Cookie.get('promoterCode') !== 'null' ? Cookie.get('promoterCode') : '';
        this.setState({
            share_link: window.BT_URL + link_code
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
        const { share_link, list, cumulativeCommission, inviterNumber, modal_show } = this.state;
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
                            <p>1.好友通过邀请注册并在xx日内购买该平台项目，则认为邀请好友成功；</p>
                            <p>2.以上奖励以优惠券形式在您的好友出借后实时发送到您的账户中，可在【推广】中查看；</p>
                            <p> 3.奖励均为平台币，有效期xx天，可叠加使用；</p>
                            <p>4.如有任何恶意刷币行为，一经查实所得奖励将不予兑现，BTTMALL对邀请活动保留最终解释权。</p>
                            <p> 如有任何疑问</p>
                            <p> 如有任何疑问 敬请咨询BTTMALL客服热线400-222-88888，</p>
                            <p> 或咨询BTTMALL官方群（群号：789789789766）。</p>
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
                                        <div>初始产出速率：<span>24小时<em>（1440分钟）</em></span></div>
                                        <div>当前产出速率：<span>4.8小时<em>（288分钟）</em></span></div>
                                        <div>可以加速产出：<span>4.8小时<em>（288分钟）</em></span></div>
                                        <div>每邀请一个好友购买商品可加速产出<span>28.8分钟</span></div>
                                        <div>（一个账号仅一个加速机会）</div>
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