import React, { Component } from 'react';
import { Link }  from 'react-router-dom';
import { getQueryString } from '../../utils/operLocation.js';
import { message, Modal } from 'antd';
import $home_api from '../../fetch/api/home';
import logo_img from '../../assets/images/icon1.png';

const { confirm } = Modal;

const orderDetail = class orderDetail extends Component {
    constructor() {
        super()
        this.state = {
            orderId: '', //订单id
            coinSymbol: '', //币种
            orderItem: [], // 订单商品列表
            orderState: 0, //订单状态
            orderStatus: '',//订单状态
            receiverCustomerDTO: {}, //订单详情
            goods_total_price: 0, // 订单总额
			goods_count: 0, // 订单数量
        }
    }
    componentDidMount() {
        const { orderId } = getQueryString(this.props.location.search);
        if (orderId) {
            this.getOrderDetail(orderId);
        }
    }
    // 取消订单
    cancelOrder(id) {
        const _this = this;
        confirm({
            title: '取消订单',
            onOk() {
                return new Promise((resolve, reject) => {
                    $home_api.cancelOrderById({orderNumber: id}).then((obj_req) => {
                        if (obj_req) {
                            message.success('订单取消成功');
                            _this.getOrderDetail(_this.state.orderId);
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            }
        })
    }
    // 获取订单详情
    async getOrderDetail(id) {
        const obj_req = await $home_api.queryOrderInfo({orderNumber: id})
        if (obj_req) {
            const { coinSymbol, orderItem, orderState, orderStatus, receiverCustomerDTO } = obj_req.data.data;
            // 计算总件数
            const goods_count = orderItem.reduce((total, v) => {
                return total +  parseInt(v['goodCount']);
            }, 0)
            // 计算总金额
            const goods_total_price = orderItem.reduce((total, v) => {
                return total + parseInt(v['goodCount'] * v['price']);
            }, 0)
            this.setState({
                orderId: id,
                coinSymbol: coinSymbol,
                orderItem: orderItem,
                orderState: orderState,
                orderStatus: orderStatus,
                receiverCustomerDTO: receiverCustomerDTO,
                goods_total_price: goods_total_price,
                goods_count: goods_count
            })
        }
    }
    render() {
        const { orderId, orderStatus, orderState, receiverCustomerDTO, coinSymbol, goods_total_price, goods_count, orderItem} = this.state;
        return (
            <div className="orderDetail-page">
                <div className="orderDetail-main">
                    {/* 订单状态 */}
                    <div className="orderDetaOne cleafix">
                        <div className="orDeLeft fl">
                            <h2>订单编号：{orderId}</h2>
                            <h3>{orderStatus}</h3>
                            {
                                orderState === 0 ? <h4><Link to={'/payment?orderId=' + orderId}>付款</Link></h4> : null
                            }
                            {
                                orderState === 0 ? <h5><span onClick={this.cancelOrder.bind(this, orderId)}>取消订单</span></h5> : null
                            }
                        </div>
                        <div className="orDeRight fl">
                            <p>该订单会为您保留24小时（从下单开始计时），24小时后如果还未付款，系统将自动取消订单。</p>
                            <ul className={orderState === 0 ? 'cleafix' : (orderState === 1 ? 'cleafix sendGoods' : 'cleafix cancelDiv')}>
                                <li className="ico1">
                                    <i></i>
                                    <h2>提交订单</h2>
                                    <h3>2018-09-27<br />16:47:46</h3>
                                </li>
                                <li className="ico2">
                                    <i></i>
                                    <h2>付款成功</h2>
                                </li>
                                <li className="ico3">
                                    <i></i>
                                    <h2>完成</h2>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* 订单信息 */}
                    <div className="orderDeraTwo cleafix">
                        <ul>
                            <li>
                                <h2>订单信息</h2>
                                <p>收货人： {receiverCustomerDTO.receiverName}</p>
                                <p>地址：  {receiverCustomerDTO.receiverAddress}</p>
                                <p>手机号码： {receiverCustomerDTO.receiverPhone}</p>
                            </li>
                            {
                                orderState === 9 ? (
                                    <li>
                                        <h2>配送信息</h2>
                                        <p>配送方式： {receiverCustomerDTO.deliveryName}</p>
                                        <p>运单号： {receiverCustomerDTO.deliveryNo}</p>
                                    </li>
                                ) : null
                            }
                            <li>
                                <h2>付款信息</h2>
                                <p>付款方式： 在线支付</p>
                                <p className="goodsPrice">商品总额： <span>{goods_total_price + ' ' + coinSymbol}</span></p>
                                <p className="goodsPrice">应支付金额： <em>{goods_total_price + ' ' + coinSymbol}</em></p>
                            </li>
                        </ul>
                    </div>
                    {/* 订单商品列表 */}
                    <div className="orderDeraThree">
                        <div className="orderList">
                            <ul>
                                {
                                    orderItem.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                {
                                                    index === 0 ? (
                                                        <div className="orderDeta">
                                                            <p><img src={logo_img} alt="" />{item.produceName}</p>
                                                        </div>
                                                    ) : null
                                                }
                                                {
                                                    index === 0 ? (
                                                        <div className="listTop">
                                                            <span className="ico7">商品</span>
                                                            <span className="ico3">商品编号</span>
                                                            <span className="ico4">价格</span>
                                                            <span className="ico5">商品数量</span>
                                                            <span className="ico6">操作</span>
                                                        </div>
                                                    ) : null
                                                }
                                                <div className="orderMain">
                                                    <div className="orderInfor">
                                                        <div className="orderImg">
                                                            <div>
                                                                <img src={window.BACK_URL + item.goodImgUrl} alt="" />
                                                            </div>
                                                        </div>
                                                        <div className="orderTxt">
                                                            <p>
                                                                {/* <a href="javascript:;">{item.goodsName}</a> */}
                                                                <Link to={'/goodsDetail?goodsId=' + item.goodNumber}>{item.goodsName}</Link>
                                                            </p>
                                                            <h6>备注：{item.note}</h6>
                                                        </div>
                                                    </div>
                                                    <div className="orderConsi"><span>{item.goodNumber}</span></div>
                                                    <div className="orderMoney">
                                                        <h6>{item.price + ' ' + coinSymbol}</h6>
                                                    </div>
                                                    <div className="orderState">
                                                        <span className="cancelBox">{item.goodCount}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="orderBom">
                            <h2><span>{goods_total_price + ' ' + coinSymbol}</span><em>{goods_count}件商品，总商品金额：</em></h2>
                            <h3><span>{goods_total_price + ' ' + coinSymbol}</span><em>应付总额：</em></h3>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default orderDetail;