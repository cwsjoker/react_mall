import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { message } from 'antd';
import { getQueryString } from '../../utils/operLocation.js';
import $home_api from '../../fetch/api/home';
import $user_api from '../../fetch/api/user';
import grounp_img from '../../assets/images/Group 4.png';

const Payment = class Payment extends Component {
    constructor() {
        super();
        this.state = {
            orderId: '',
            orderInfo: {
				// addr: '',
				// name: '',
				// info: '',
				// img: '',
            }, //订单详情
            symbol: '',
            show_info: false,
            available: '',
            total: '',
            password_list: ['','','','','','']
        }
    }
    async componentDidMount() {
        const { orderId } = getQueryString(this.props.location.search);
        const info_req = await $home_api.queryOrderInfo({orderNumber: orderId});
        if (info_req) {
            const { coinSymbol, orderItem, receiverCustomerDTO } = info_req.data.data;
            const orderInfo = {
                addr: receiverCustomerDTO.receiverAddress,
				name: receiverCustomerDTO.receiverName + ' ' +receiverCustomerDTO.receiverPhone,
				info: orderItem[0]['goodsName'],
				img: orderItem[0]['goodImgUrl'],
            }
            // 计算订单的总价格
            const total = orderItem.reduce((total, v) => {
                return total + (parseInt(v.goodCount) *parseInt(v.price)); 
            }, 0)
            // 获取账户余额
            const res_blance = await $user_api.getUserFinance({coinSymbol: coinSymbol});
            if (res_blance) {
                this.setState({
                    orderId: orderId,
                    orderInfo: orderInfo,
                    symbol: coinSymbol,
                    available: res_blance.data.data.available,
                    total: total,
                })
            }
        }
    }
    // 展示订单详情
    showOrderInfo() {
        this.setState({
            show_info: !this.state.show_info
        })
    }
    change_pass(index, e) {
        e.preventDefault();
        if (e.target.value && !/[0-9]/.test(e.target.value)) {
            return;
        }
        const list = this.state.password_list;
        list[index] = e.target.value;
        let is = e.target.value ? true : false;
        this.setState({
            password_list: list
        }, () => {
            if (index <= 4 && is) {
                document.getElementsByClassName('password')[index + 1].focus();
            }
        })
    }
    keyUp(index, e) {
        e.preventDefault();
        if ((e.keyCode === 8 || e.keyCode === 37) &&　index !== 0) {
                document.getElementsByClassName('password')[index - 1].focus();
        }
        if (e.keyCode === 39 && index <= 4) {
            document.getElementsByClassName('password')[index + 1].focus();
        }

    }
    async payment() {
        const password = this.state.password_list.join('');
        if (password.length !== 6) {
            message.error('密码不符合规则，不满6位数');
            return;
        }
        const payment_req  = await $home_api.orderPayment({orderNumber: this.state.orderId, payPassword: password});
        if (payment_req) {
            message.success('支付成功');
            this.props.history.push('/myOrder');
        } else {
            this.setState({
                password_list: ['','','','','','']
            })
        }
    }
    render() {
        const { orderId, orderInfo, show_info, symbol, available, total, password_list } = this.state;
        return (
            <div className="payment-page">
                <div className="payment-main">
                    {/* 订单详情 */}
                    <div className="payment-order-main cleafix">
                        <div className="checktopLeft fl">
                            <h2><i></i>订单提交成功，请尽快付款！订单号：<span>{orderId}</span></h2>
                            <p>请您在24小时内完成支付，否则订单会被自动取消(库存紧俏订单请参见详情页时限)</p>
                        </div>
                        <div className="checktopRight fr">
                            <h4 onClick={this.showOrderInfo.bind(this)}><span>订单详情<i></i></span></h4>
                        </div>
                        {/* 订单商品列表 */}
                        {
                            show_info ? (
                                <div className="checkOrderData">
                                    <div className="checkOrderDataImg fl">
                                        <div>
                                            <img src={window.BACK_URL + orderInfo.img} alt="" />
                                        </div>
                                    </div>
                                    <div className="checkOrderDataTxt fl">
                                        <p>收货地址：{orderInfo.addr}</p>
                                        <p>收货人：{orderInfo.name}</p>
                                        <p>商品名称：{orderInfo.info}</p>
                                    </div>
                                </div>
                            ) : null                       
                        }
                    </div>
                    {/* 支付信息 */}
                    <div className="payment-info-main">
                        <h1>bttmall</h1>
                        <h2>在线支付-安全便捷</h2>
                        <div className="paymentOne cleafix">
                            <div className="payOneLeft fl">
                                <img src={grounp_img} alt="" />
                                <h2>
                                    <span>当前余额：<em>{available}</em>{symbol}</span>
                                    <strong>前去<a href={window.BT_URL}>交易</a></strong>
                                </h2>
                            </div>
                            <div className="payOneRight fr">
                                <h2>支付金额<span>{total}</span>{symbol}</h2>
                            </div>
                        </div>
                        <div className="paymentOne">
                            <div className="paymentTwo">
                                <p>请输入6位数字支付密码</p>
                                <div className="passwordDiv cleafix">
                                    {
                                        password_list.map((item, index) => {
                                            return (
                                                <input autoComplete="off" key={index} name="pay_pass" type="password" maxLength="1" className="password" value={item}
                                                onChange={this.change_pass.bind(this, index)} 
                                                onKeyUp={this.keyUp.bind(this, index)} />
                                            )
                                        })
                                    }
                                    <a href={window.BT_URL + 'ex/member/user'}>忘记支付密码？</a>
                                </div>
                                <div className="payBtn">
                                    <span></span>
                                    <input className="paymentBut" type="button" value="立即支付" onClick={this.payment.bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Payment);